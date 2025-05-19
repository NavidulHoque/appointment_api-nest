import { Injectable } from '@nestjs/common';
import { AppointmentDto } from './dto';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentService {

    constructor(
        private prisma: PrismaService,
        private handleErrorsService: HandleErrorsService
    ) { }

    //admin dashboard
    async getAllAppointments(
        page: number,
        limit: number,
        search: string,
        doctorId: string,
        patientId: string,
        status: string,
        isPaid: boolean,
        paymentMethod: string,
        isCompleted: boolean,
    ) {
        const skip = (page - 1) * limit;
        let orderBy: any = { createdAt: 'desc' }

        const query: any = doctorId ? { doctorId } : {}

        if (patientId) query.patientId = patientId

        if (status) {
            query.status = { status: { contains: status, mode: 'insensitive' } }

            if (status.toLowerCase() === 'pending') {
                orderBy = { date: 'asc' }
            }

            else if (status.toLowerCase() === 'completed') {
                orderBy = { date: 'desc' }
            }
        }

        if (isPaid) query.isPaid = isPaid

        if (paymentMethod) query.paymentMethod = { status: { contains: paymentMethod, mode: 'insensitive' } }

        if (isCompleted) query.isCompleted = isCompleted

        if (search) {
            query.OR = [
                { status: { contains: search, mode: 'insensitive' } },
                { paymentMethod: { contains: search, mode: 'insensitive' } },
                {
                    doctor: {
                        OR: [
                            { fullName: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                },
                {
                    patient: {
                        OR: [
                            { fullName: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                },
            ]
        }

        try {
            const [appointments, totalAppointments] = await this.prisma.$transaction([
                this.prisma.appointment.findMany({
                    where: query,
                    orderBy: {
                        date: 'asc',
                    },
                    select: {
                        doctor: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                            }
                        },
                        patient: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                            },
                        },
                        date: true,
                        status: true,
                        isPaid: true,
                        paymentMethod: true,
                        isCompleted: true,
                    },
                    take: limit,
                    skip
                }),

                this.prisma.appointment.count({ where: query })
            ])

            return {
                data: appointments,
                pagination: {
                    totalItems: totalAppointments,
                    totalPages: Math.ceil(totalAppointments / limit),
                    currentPage: page,
                    itemsPerPage: limit
                },
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async getTotalAppointmentCount() {

        try {
            const totalAppointments = await this.prisma.appointment.count()

            return {
                data: totalAppointments
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async getTotalAppointmentsGraph() {

    }

    //patient dashboard
    async getAppointmentsGraphOfPatient() {

    }

    //doctor dashboard
    async getTotalAppointmentsCountOfDoctor() {

    }

    async getAllAppointmentsTodayOfDoctor() {

    }

    async getAppointmentsGraphOfDoctor() {

    }

    //both
    async createAppointment(dto: AppointmentDto) {

        const { patientId, doctorId, date } = dto

        try {

            const appointment = await this.prisma.appointment.create({ data: { patientId, doctorId, date } })

            return {
                appointment,
                message: "Appointment created successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }

    }

    getAllPatients() {

    }

    async getAnAppointment(id: string) {

        try {

            const appointment = await this.prisma.appointment.findUnique({ where: { id } })

            if (!appointment) {
                this.handleErrorsService.throwNotFoundError("Appointment not found")
            }

            return {
                appointment
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }

    }

    async updateAppointment(dto: AppointmentDto, id: string) {

        const { patientId, doctorId, date } = dto

        try {

            const appointment = await this.prisma.appointment.update({ where: { id }, data: { patientId, doctorId, date } })

            if (!appointment) {
                this.handleErrorsService.throwNotFoundError("Appointment not found")
            }

            return {
                appointment,
                message: "Appointment updated successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }

    }

    async updateAppointmentStatus() {

    }

    async deleteAppointment(id: string) {

        try {
            const appointment = await this.prisma.appointment.delete({ where: { id } })

            if (!appointment) {
                this.handleErrorsService.throwNotFoundError("Appointment not found")
            }

            return {
                message: "Appointment deleted successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }
}
