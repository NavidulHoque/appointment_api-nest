import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
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
    getAnAppointment(@Param('id') id: string) {
        this.appointmentService.getAnAppointment(id)
    }

    @Put("/:id")
    updateAppointment(@Body() dto: AppointmentDto, @Param('id') id: string) {
        this.appointmentService.updateAppointment(dto, id)
    }

    @Delete("/:id")
    deleteAppointment(@Param('id') id: string) {
        this.appointmentService.deleteAppointment(id)
    }
}
