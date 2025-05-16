import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorDto } from './dto';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { PrismaService } from 'src/prisma/prisma.service';

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

        if (education) query['education'] = { contains: education, mode: 'insensitive' }  //will filter case-insensitive

        if (experience?.length === 2) {
            const [min, max] = experience;
            query['experience'] = { gte: min, lte: max };
        }

        if (weeks?.length) {
            query['OR'] = weeks.map(week => ({
                availableTimes: {
                    some: { contains: week }
                }
            }));
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
                {
                    user: {
                        OR: [
                            { fullName: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                }
            ];
        }

        try {
            const doctors = await this.prisma.doctor.findMany({ where: query })

            return {
                doctors
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    //also send other related doctors in the response
    async getADoctor(id: string) {

        try {

            const doctor = await this.prisma.doctor.findUnique({ where: { id } })

            if (!doctor) {
                this.handleErrorsService.throwNotFoundError("Doctor not found")
            }

            return {
                doctor
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async allPatients() {

    }

    async updateDoctor(dto: DoctorDto, id: string) {

        const { specialization, education, experience, aboutMe, fees } = dto

        try {

            const doctor = await this.prisma.doctor.update({
                where: { id },
                data: { specialization, education, experience, aboutMe, fees }
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

    async addAvailableTimes() {

    }

    async makeDoctorActive() {

    }

    async makeDoctorInactive() {

    }

    async deleteDoctor(id: string) {

        try {
            const doctor = await this.prisma.doctor.delete({ where: { id } })

            if (!doctor) {
                this.handleErrorsService.throwNotFoundError("Doctor not found")
            }

            return {
                message: "Doctor deleted successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }
}
