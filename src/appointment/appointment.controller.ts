import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AuthGuard } from 'src/auth/guard';
import { AppointmentDto } from './dto';

@UseGuards(AuthGuard)
@Controller('appointments')
export class AppointmentController {

    constructor(private appointmentService: AppointmentService) { }

    @Post("/")
    createAppointment(@Body() dto: AppointmentDto) {
        this.appointmentService.createAppointment(dto)
    }

    @Get("/")
    getAllAppointments() {
        this.appointmentService.getAllAppointments()
    }

    @Get("/:id")
    getAnAppointment() {
        this.appointmentService.getAnAppointment()
    }

    @Put("/:id")
    updateAppointment(@Body() dto: AppointmentDto) {
        this.appointmentService.updateAppointment(dto)
    }

    @Delete("/:id")
    deleteAppointment() {
        this.appointmentService.deleteAppointment()
    }
}
