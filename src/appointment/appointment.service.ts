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
    async getAllAppointments(page: number, limit: number) {
        const skip = (page - 1) * limit;

        try {
            const [appointments, total] = await this.prisma.$transaction([
                this.prisma.appointment.findMany({
                    skip,
                    take: limit,
                    orderBy: {
                        date: 'desc',
                    },
                }),
                this.prisma.appointment.count()
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                data: appointments,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    limit,
                },
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async getAllCancelledAppointments(page: number, limit: number) {
        const skip = (page - 1) * limit;

        try {
            const [cancelledAppointments, total] = await this.prisma.$transaction([
                this.prisma.appointment.findMany({
                    where: { status: "CANCELLED" },
                    skip,
                    take: limit,
                    orderBy: {
                        date: 'desc',
                    },
                }),
                this.prisma.appointment.count({
                    where: { status: 'CANCELLED' }
                }),
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                data: cancelledAppointments,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    limit,
                },
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async getAllPendingAppointments(page: number, limit: number) {
        const skip = (page - 1) * limit;

        try {
            const [pendingAppointments, total] = await this.prisma.$transaction([
                this.prisma.appointment.findMany({
                    where: { status: "PENDING" },
                    skip,
                    take: limit,
                    orderBy: {
                        date: 'desc',
                    },
                }),
                this.prisma.appointment.count({
                    where: { status: 'PENDING' }
                }),
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                data: pendingAppointments,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    limit,
                },
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async getAllCompletedAppointments(page: number, limit: number) {
        const skip = (page - 1) * limit;

        try {
            const [completedAppointments, total] = await this.prisma.$transaction([
                this.prisma.appointment.findMany({
                    where: { status: "COMPLETED" },
                    skip,
                    take: limit,
                    orderBy: {
                        date: 'desc',
                    },
                }),
                this.prisma.appointment.count({
                    where: { status: 'COMPLETED' }
                }),
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                data: completedAppointments,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    limit,
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
    async getAllAppointmentsOfPatient() {
        const appointments = await this.prisma.appointment.findMany({})
    }

    async getAppointmentsGraphOfPatient() {

    }

    //doctor dashboard
    async getAllAppointmentsOfDoctor() {

    }

    async getTotalAppointmentsCountOfDoctor() {

    }

    async getAllAppointmentsTodayOfDoctor() {

    }

    async getAllCancelledAppointmentsOfDoctor() {

    }

    async getAllPendingAppointmentsOfDoctor() {

    }

    async getAllCompletedAppointmentsOfDoctor() {

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
