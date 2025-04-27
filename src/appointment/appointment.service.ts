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
    async getAllAppointments(page: number, limit: number, search: string, status: string, paymentMethod: string) {

        status = status.toLowerCase() || ""
        search = search.toLowerCase() || ""
        paymentMethod = paymentMethod.toLowerCase() || ""
        const skip = (page - 1) * limit;

        try {
            const appointments = await this.prisma.appointment.findMany({
                orderBy: {
                    date: 'asc',
                },
                include: {
                    doctor: {
                        include: {
                            user: true,
                        },
                    },
                    patient: {
                        include: {
                            user: true,
                        },
                    },
                },
            })

            let filteredAppointments = appointments.filter((appointment) => {
                const doctorName = appointment.doctor.user.fullName.toLowerCase() || ""
                const patientName = appointment.patient.user.fullName.toLowerCase() || ""
                const appointmentStatus = appointment.status.toLowerCase() || ""
                const appointmentPaymentMethod = appointment.paymentMethod?.toLowerCase() || ""

                const matchesSearch = search ? search.includes(doctorName) || search.includes(patientName) || search.includes(appointmentStatus) || search.includes(appointmentPaymentMethod) : true;

                const matchesStatus = status ? status === appointmentStatus : true

                const matchesPaymentMethod = paymentMethod ? paymentMethod === appointmentPaymentMethod : true

                return matchesSearch && matchesStatus && matchesPaymentMethod;
            })

            const totalItems = filteredAppointments.length;
            const totalPages = Math.ceil(totalItems / limit);

            const paginatedAppointments = filteredAppointments.slice(skip, skip + limit);

            return {
                data: paginatedAppointments,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    limit
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
