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

    async getAllAppointments() {

        try {
            const appointments = await this.prisma.appointment.findMany()

            return {
                appointments
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }

    }

    async getAllAppointmentsOfPatient() {

    }

    async getAllAppointmentsOfDoctor() {

    }

    async getAllCancelledAppointments() {

    }

    async getAllPendingAppointments() {

    }

    async getAllCompletedAppointments() {

    }

    async getTotalAppointmentCount() {

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

    async getAppointmentsGraphOfPatient() {

    }

    async getAppointmentsGraphOfDoctor() {

    }

    async getTotalAppointmentsGraph() {

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
