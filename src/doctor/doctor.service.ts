import { Injectable, NotFoundException, Get } from '@nestjs/common';
import { CreateDoctorDto, GetDoctorsDto, UpdateDoctorDto } from './dto';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { doctorSelect } from 'src/prisma/prisma-selects';
import { UserDto } from 'src/user/dto';

@Injectable()
export class DoctorService {

    constructor(
        private prisma: PrismaService,
        private handleErrorsService: HandleErrorsService
    ) { }

    async createDoctor(dto: CreateDoctorDto) {

        const { userId, specialization, education, experience, aboutMe, fees, availableTimes } = dto

        try {
            const existingDoctor = await this.prisma.doctor.findFirst({ where: { userId } })

            if (existingDoctor) this.handleErrorsService.throwBadRequestError("Doctor already exists")

            const [newDoctor] = await this.prisma.$transaction([
                this.prisma.doctor.create({
                    data: { userId, specialization, education, experience, aboutMe, fees, availableTimes },
                }),
                this.prisma.user.update({
                    where: { id: userId },
                    data: { role: 'DOCTOR' },
                }),
            ]);

            return {
                doctor: newDoctor,
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

        const skip = (page as number - 1) * (limit as number)

        try {
            const fetchedDoctor = await this.prisma.doctor.findUnique({
                where: { userId: id },
                select: doctorSelect
            })

            if (!fetchedDoctor) this.handleErrorsService.throwNotFoundError("Doctor not found");

            const [reviews, totalReviews, averageRating, relatedDoctors] = await this.prisma.$transaction([

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
                },
                pagination: {
                    totalItems: totalReviews,
                    totalPages: Math.ceil(totalReviews / (limit as number)),
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

        const { specialization, education, experience, aboutMe, fees, availableTimes } = dto

        try {

            const doctor = await this.prisma.doctor.update({
                where: { userId: id },
                data: { specialization, education, experience, aboutMe, fees, availableTimes }
            })

            if (!doctor) {
                this.handleErrorsService.throwNotFoundError("Doctor not found")
            }

            return {
                doctor,
                message: "Doctor updated successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async addAvailableTime(id: string, availableTime: string) {

        try {

            const doctor = await this.prisma.doctor.update({
                where: { userId: id },
                data: {
                    availableTimes: {
                        push: availableTime
                    }
                }
            })

            if (!doctor) this.handleErrorsService.throwNotFoundError("Doctor not found")

            return {
                data: doctor,
                message: "Available time added successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async removeAvailableTime(id: string, availableTime: string) {

        try {
            const doctorRecord = await this.prisma.doctor.findUnique({ where: { userId: id } });

            if (!doctorRecord) this.handleErrorsService.throwNotFoundError("Doctor not found")

            const updatedAvailableTimes = doctorRecord?.availableTimes.filter((time: string) => time !== availableTime);

            const doctor = await this.prisma.doctor.update({
                where: { userId: id },
                data: {
                    availableTimes: updatedAvailableTimes
                }
            });

            return {
                data: doctor,
                message: "Available time removed successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }


    async makeDoctorActive(id: string) {

        try {

            const doctor = await this.prisma.doctor.update({
                where: { userId: id },
                data: {
                    isActive: true
                }
            })

            if (!doctor) this.handleErrorsService.throwNotFoundError("Doctor not found")

            return {
                message: "Doctor activated successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async makeDoctorInactive(id: string) {

        try {

            const doctor = await this.prisma.doctor.update({
                where: { userId: id },
                data: {
                    isActive: false
                }
            })

            if (!doctor) this.handleErrorsService.throwNotFoundError("Doctor not found")

            return {
                message: "Doctor deactivated successfully"
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
