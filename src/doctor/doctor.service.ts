import { Injectable, NotFoundException, Get } from '@nestjs/common';
import { CreateDoctorDto, GetDoctorsDto, UpdateDoctorDto } from './dto';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { doctorSelect } from 'src/prisma/prisma-selects';
import { UserDto } from 'src/user/dto';
import * as argon from "argon2";
import { FetchUserService } from 'src/common/fetchUser.service';
import { ComparePasswordService } from 'src/common/comparePassword.service';

@Injectable()
export class DoctorService {

    constructor(
        private prisma: PrismaService,
        private handleErrorsService: HandleErrorsService,
        private fetchUserService: FetchUserService,
        private comparePasswordService: ComparePasswordService
    ) { }

    async createDoctor(dto: CreateDoctorDto) {

        const { fullName, email, password, specialization, education, experience, aboutMe, fees, availableTimes } = dto

        try {
            const existingDoctor = await this.prisma.user.findFirst({ where: { email } })

            if (existingDoctor) this.handleErrorsService.throwBadRequestError("Doctor already exists")

            const hashedPassword = await argon.hash(password);

            const { id, fullName: newFullName, email: newEmail } = await this.prisma.user.create({ data: { fullName, email, password: hashedPassword, role: 'DOCTOR' } })

            const newDoctor = await this.prisma.doctor.create({
                data: { userId: id, specialization, education, experience, aboutMe, fees, availableTimes }
            });

            return {
                doctor: {
                    fullName: newFullName,
                    email: newEmail,
                    ...newDoctor
                },
                message: "Doctor created successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async getAllDoctors(queryParams: GetDoctorsDto) {

        const { page, limit, search, specialization, experience, fees, weeks, isActive } = queryParams

        const skip = (page - 1) * limit

        const query: any = specialization ? { specialization: { contains: specialization, mode: 'insensitive' as const } } : {} // will filter case-insensitive

        if (experience?.length === 2) {
            const [min, max] = experience;
            query['experience'] = { gte: min, lte: max };
        }

        if (fees?.length === 2) {
            const [min, max] = fees;
            query['fees'] = { gte: min, lte: max };
        }

        if (isActive !== undefined) query['isActive'] = isActive

        try {
            const doctors = await this.prisma.doctor.findMany({
                where: query,
                select: doctorSelect,
            })

            if (!doctors) this.handleErrorsService.throwNotFoundError("Doctors not found")

            let filteredDoctors = doctors.filter((doctor) => {

                const specialization = doctor.specialization?.toLowerCase() || "";
                const education = doctor.education?.toLowerCase() || "";
                const aboutMe = doctor.aboutMe?.toLowerCase() || "";
                const fullName = doctor.user?.fullName?.toLowerCase() || "";
                const email = doctor.user?.email?.toLowerCase() || "";
                const availableTimes = doctor.availableTimes?.map(time => time.toLowerCase()) || [];

                const matchedSearch = search
                    ? specialization.includes(search) ||
                    education.includes(search) ||
                    aboutMe.includes(search) ||
                    fullName.includes(search) ||
                    email.includes(search) ||
                    availableTimes.some(time => time.includes(search))
                    : true;

                const matchedWeeks = weeks
                    ? availableTimes.some(time => weeks.some(week => time.includes(week)))
                    : true;

                return matchedSearch && matchedWeeks;
            })

            //sort doctors based on average rating
            const sortedDoctors = await this.modifyDoctors(filteredDoctors)

            const totalItems = sortedDoctors.length

            const paginatedDoctors = sortedDoctors.slice(skip, skip + limit)

            return {
                data: paginatedDoctors,
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page,
                    itemsPerPage: limit
                },
                message: "Doctors fetched successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async getADoctor(id: string, queryParams: GetDoctorsDto) {

        const { page, limit } = queryParams

        const skip = (page - 1) * limit

        try {
            const fetchedDoctor = await this.prisma.doctor.findUnique({
                where: { userId: id },
                select: doctorSelect
            })

            if (!fetchedDoctor) this.handleErrorsService.throwNotFoundError("Doctor not found");

            const [reviews, totalReviews, averageRating, relatedDoctors, bookedAppointmentDates] = await this.prisma.$transaction([

                this.prisma.review.findMany({
                    where: { doctorId: id },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        patient: {
                            select: {
                                fullName: true,
                                email: true
                            }
                        },
                        comment: true,
                        rating: true,
                        createdAt: true
                    },
                    skip: skip,
                    take: limit
                }),

                this.prisma.review.count({ where: { doctorId: id } }),

                this.prisma.review.aggregate({
                    where: { doctorId: id },
                    _avg: { rating: true }
                }),

                this.prisma.doctor.findMany({
                    where: {
                        specialization: fetchedDoctor?.specialization,
                        isActive: true,
                        userId: {
                            not: id,
                        }
                    },
                    take: 5,
                    select: doctorSelect
                }),

                this.prisma.appointment.findMany({
                    where: {
                        doctorId: id,
                        status: {
                            in: ["PENDING", "CONFIRMED"]
                        }
                    },
                    select: {
                        date: true
                    },

                })
            ])

            //sort doctors based on average rating
            const sortedRelatedDoctors = await this.modifyDoctors(relatedDoctors)

            return {
                data: {
                    doctor: {
                        ...fetchedDoctor,
                        averageRating: averageRating._avg.rating,
                        totalReviews,
                        reviews
                    },
                    relatedDoctors: sortedRelatedDoctors,
                    bookedAppointmentDates
                },
                pagination: {
                    totalItems: totalReviews,
                    totalPages: Math.ceil(totalReviews / limit),
                    currentPage: page,
                    itemsPerPage: limit
                },
                message: "Doctor fetched successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    private async modifyDoctors(doctors: any[]) {

        const doctorsWithRating = await Promise.all(doctors.map(async (doctor) => {

            const [totalReviews, averageRating] = await this.prisma.$transaction([
                this.prisma.review.count({ where: { doctorId: doctor.userId } }),
                this.prisma.review.aggregate({
                    where: { doctorId: doctor.userId },
                    _avg: { rating: true },
                }),
            ]);

            return {
                ...doctor,
                totalReviews,
                averageRating: averageRating._avg.rating ? averageRating._avg.rating : 0,
            };
        }))

        const sortedDoctors = doctorsWithRating.sort((a, b) => {

            if (a.averageRating === b.averageRating) {
                return b.experience - a.experience;
            }

            else {
                return b.averageRating - a.averageRating
            }
        })

        return sortedDoctors
    }

    async getTotalRevenue(user: UserDto) {

        const { id } = user

        try {
            const doctor = await this.prisma.doctor.findUnique({
                where: { userId: id },
                select: { revenue: true }
            })

            if (!doctor) this.handleErrorsService.throwNotFoundError("Doctor not found")

            return {
                totalRevenue: doctor?.revenue,
                message: "Total revenue of doctor fetched successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async updateDoctor(dto: UpdateDoctorDto, id: string) {

        const { fullName, email, currentPassword, newPassword, phone, gender, birthDate, address, specialization, education, experience, aboutMe, fees, addAvailableTime, removeAvailableTime, isActive } = dto

        let userData: any = null
        let doctorData: any = null

        if (fullName && email && phone && gender && birthDate && address && specialization && education && experience && aboutMe && fees) {
            userData = {
                fullName,
                email,
                phone,
                gender,
                birthDate,
                address
            }

            doctorData = {
                specialization,
                education,
                experience,
                aboutMe,
                fees
            }
        }

        if (addAvailableTime) {
            doctorData.availableTimes = {
                push: addAvailableTime
            }
        }

        if (isActive !== undefined) doctorData.isActive = isActive

        try {

            if (currentPassword && newPassword) {

                const user = await this.prisma.user.findUnique({ where: { id } })

                if (!user) this.handleErrorsService.throwNotFoundError("User not found")

                const isMatched = await this.comparePasswordService.comparePassword(currentPassword, user?.password as string)

                if (!isMatched) this.handleErrorsService.throwBadRequestError("Current password invalid")

                const hashedPassword = await argon.hash(newPassword)

                await this.prisma.user.update({
                    where: { id },
                    data: {
                        password: hashedPassword
                    }
                })

                return {
                    message: "Password updated successfully"
                }
            }

            if (removeAvailableTime) {
                const doctorRecord = await this.prisma.doctor.findUnique({ where: { userId: id } })

                if (!doctorRecord) this.handleErrorsService.throwNotFoundError("Doctor not found")

                const updatedAvailableTimes = doctorRecord?.availableTimes.filter((time: string) => time !== removeAvailableTime);

                doctorData.availableTimes = updatedAvailableTimes
            }

            if (userData) {

                const existingUser = await this.fetchUserService.fetchUser(email)

                if (existingUser && id !== existingUser.id) {
                    this.handleErrorsService.throwBadRequestError("Email already exists")
                }

                await this.prisma.user.update({
                    where: { id },
                    data: userData
                })
            }

            const doctor = await this.prisma.doctor.update({
                where: { userId: id },
                data: doctorData,
                select: {
                    specialization: true,
                    education: true,
                    experience: true,
                    aboutMe: true,
                    fees: true,
                    availableTimes: true,
                    isActive: true
                }
            })

            if (!doctor) this.handleErrorsService.throwNotFoundError("Doctor not found")

            return {
                data: {
                    fullName,
                    email,
                    phone,
                    gender,
                    birthDate,
                    address,
                    ...doctor
                },
                message: "Doctor updated successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async deleteDoctor(id: string) {

        try {
            const doctor = await this.prisma.doctor.delete({ where: { userId: id } })

            if (!doctor) this.handleErrorsService.throwNotFoundError("Doctor not found")

            return {
                message: "Doctor deleted successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }
}
