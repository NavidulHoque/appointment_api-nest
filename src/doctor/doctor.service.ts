import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorDto } from './dto';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { doctorSelect } from 'src/prisma/prisma-selects';

@Injectable()
export class DoctorService {

    constructor(
        private prisma: PrismaService,
        private handleErrorsService: HandleErrorsService
    ) { }

    async createDoctor(dto: DoctorDto) {

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

    async getAllDoctors(page: number, limit: number, specialization: string, education: string, experience: number[], weeks: string[], fees: number[], isActive: boolean, search: string) {

        const query: any = specialization ? { specialization: { contains: specialization, mode: 'insensitive' as const } } : {}

        if (education) query['education'] = { contains: education, mode: 'insensitive' }  // will filter case-insensitive

        if (experience?.length === 2) {
            const [min, max] = experience;
            query['experience'] = { gte: min, lte: max };
        }

        if (weeks?.length) {
            query['OR'] = weeks.map(week => ({
                availableTimes: {
                    some: { contains: week }
                }
            }))
        }

        if (fees?.length === 2) {
            const [min, max] = fees;
            query['fees'] = { gte: min, lte: max };
        }

        if (isActive) query['isActive'] = isActive

        if (search) {
            query.OR = [
                ...(query.OR || []), // preserve existing OR filters (like weeks)
                { specialization: { contains: search, mode: 'insensitive' } },
                { education: { contains: search, mode: 'insensitive' } },
                { aboutMe: { contains: search, mode: 'insensitive' } },
                { availableTimes: { some: { contains: search } } },
                {
                    userId: {
                        OR: [
                            { fullName: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                }
            ];
        }

        try {
            const [doctors, count] = await this.prisma.$transaction([
                this.prisma.doctor.findMany({
                    where: query,
                    skip: (page - 1) * limit,
                    take: limit,
                    select: doctorSelect,
                }),

                this.prisma.doctor.count({ where: query })
            ])

            if (!doctors) this.handleErrorsService.throwNotFoundError("Doctors not found")

            const sortedDoctors = this.modifyDoctors(doctors)

            const totalPages = Math.ceil(count / limit)

            return {
                data: sortedDoctors,
                pagination: {
                    totalItems: count,
                    totalPages: totalPages,
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

    async getADoctor(id: string, page: number, limit: number) {

        try {

            const fetchedDoctor = await this.prisma.doctor.findUnique({
                where: { id },
                select: doctorSelect
            })

            if (!fetchedDoctor) this.handleErrorsService.throwNotFoundError("Doctor not found");

            const [totalReviews, averageRating, relatedDoctors] = await this.prisma.$transaction([

                this.prisma.review.count({ where: { doctorId: id } }),

                this.prisma.review.aggregate({
                    where: { doctorId: id },
                    _avg: { rating: true }
                }),

                this.prisma.doctor.findMany({
                    where: {
                        specialization: fetchedDoctor?.specialization,
                        isActive: true,
                        id: {
                            not: id,
                        }
                    },
                    take: 5,
                    select: doctorSelect
                })
            ])

            const sortedRelatedDoctors = this.modifyDoctors(relatedDoctors)

            return {
                data: {
                    doctor: {
                        ...fetchedDoctor,
                        averageRating: averageRating._avg.rating,
                        totalReviews
                    },
                    relatedDoctors: sortedRelatedDoctors
                },
                message: "Doctor fetched successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    private modifyDoctors(doctors: any[]) {

        const doctorsWithRating = doctors.map(doctor => {

            const totalRating = doctor.reviews.length > 0 ? doctor.reviews.reduce((acc: number, cur: any) => acc + cur.rating, 0) : 0

            const totalReviews = doctor.reviews.length

            const averageRating = totalRating ? totalRating / totalReviews : 0;

            const { reviews, ...rest } = doctor

            return {
                ...rest,
                averageRating,
                totalReviews
            }
        })

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

    async updateDoctor(dto: DoctorDto, id: string) {

        const { specialization, education, experience, aboutMe, fees, availableTimes } = dto

        try {

            const doctor = await this.prisma.doctor.update({
                where: { id },
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
                where: { id },
                data: {
                    availableTimes: {
                        push: availableTime
                    }
                }
            })

            if (!doctor) {
                this.handleErrorsService.throwNotFoundError("Doctor not found")
            }

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
            const doctorRecord = await this.prisma.doctor.findUnique({ where: { id } });

            if (!doctorRecord) this.handleErrorsService.throwNotFoundError("Doctor not found")

            const updatedAvailableTimes = doctorRecord?.availableTimes.filter((time: string) => time !== availableTime);

            const doctor = await this.prisma.doctor.update({
                where: { id },
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
                where: { id },
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
                where: { id },
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
            const doctor = await this.prisma.doctor.delete({ where: { id } })

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
