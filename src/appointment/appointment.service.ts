import { Injectable } from '@nestjs/common';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto, GetAppointmentsDto, UpdateAppointmentDto } from './dto';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class AppointmentService {

    constructor(
        private prisma: PrismaService,
        private handleErrorsService: HandleErrorsService
    ) { }

    async createAppointment(dto: CreateAppointmentDto) {

        const { patientId, doctorId, date } = dto

        if (patientId === doctorId) {
            this.handleErrorsService.throwBadRequestError("Patient and doctor cannot be the same")
        }

        if (date.getTime() < Date.now()) {
            this.handleErrorsService.throwBadRequestError("Date must be in the future")
        }

        try {
            const existingAppointment = await this.prisma.appointment.findFirst({
                where: {
                    OR: [{ patientId, doctorId }],
                    date
                }
            })

            if (existingAppointment) this.handleErrorsService.handleError("Appointment already booked")

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

    async getAllAppointments(queryParam: GetAppointmentsDto) {
        const { page = 1, limit = 10, search, doctorId, patientId, status, isPaid, paymentMethod, isToday, isPast, isFuture } = queryParam

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

        if (isPaid !== undefined) query.isPaid = isPaid

        if (paymentMethod) query.paymentMethod = { status: { contains: paymentMethod, mode: 'insensitive' } }

        if (isToday) {
            const now = new Date()
            query.date = {
                gte: startOfDay(now),
                lte: endOfDay(now)
            }
        }

        if (isPast) {
            const now = new Date()
            query.date = {
                lte: now
            }
        }

        if (isFuture) {
            const now = new Date()
            query.date = {
                gte: now
            }
        }

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
                    orderBy,
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

    async getAllAppointmentCount(queryParam: GetAppointmentsDto) {

        const { doctorId, patientId } = queryParam

        const query: any = doctorId ? { doctorId } : {}

        if (patientId) query.patientId = patientId

        try {
            const [
                totalAppointments,
                totalPendingAppointments,
                totalRunningAppointments,
                totalCompletedAppointments,
                totalCancelledAppointments,
                totalPaidAppointments,
                totalUnPaidAppointments,
                totalCashPaidAppointments,
                totalOnlinePaidAppointments
            ] = await this.prisma.$transaction([

                this.prisma.appointment.count({ where: { ...query } }),
                this.prisma.appointment.count({ where: { ...query, status: 'PENDING' } }),
                this.prisma.appointment.count({ where: { ...query, status: 'RUNNING' } }),
                this.prisma.appointment.count({ where: { ...query, status: 'COMPLETED' } }),
                this.prisma.appointment.count({ where: { ...query, status: 'CANCELLED' } }),
                this.prisma.appointment.count({ where: { ...query, isPaid: true } }),
                this.prisma.appointment.count({ where: { ...query, isPaid: false } }),
                this.prisma.appointment.count({ where: { ...query, paymentMethod: 'CASH' } }),
                this.prisma.appointment.count({ where: { ...query, paymentMethod: 'ONLINE' } }),
            ])

            return {
                data: {
                    totalAppointments,
                    totalPendingAppointments,
                    totalRunningAppointments,
                    totalCompletedAppointments,
                    totalCancelledAppointments,
                    totalPaidAppointments,
                    totalUnPaidAppointments,
                    totalCashPaidAppointments,
                    totalOnlinePaidAppointments
                },
                message: "Appointments count fetched successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
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

    async getTotalAppointmentsGraph(queryParam: GetAppointmentsDto) {

        const { doctorId, patientId } = queryParam

        const conditions = doctorId ? `"doctorId" = ${doctorId}` : patientId ? `"patientId" = ${patientId}` : ""

        const whereClause = conditions ? `WHERE ${conditions}` : '';

        const query = `
             SELECT 
               EXTRACT(YEAR FROM "date") AS year,
               EXTRACT(MONTH FROM "date") AS month,
               COUNT(*) AS total
             FROM "Appointment"
             ${whereClause}
             GROUP BY year, month
             ORDER BY year, month;
             `;

        try {
            const result = await this.prisma.$queryRaw`${query}`

            return {
                data: result,
                message: "Appointments graph fetched successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }

    }

    async updateAppointment(dto: UpdateAppointmentDto, id: string) {

        const { doctorId, date } = dto

        try {

            const appointment = await this.prisma.appointment.update({ where: { id }, data: { doctorId, date } })

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
