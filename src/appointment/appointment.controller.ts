import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AuthGuard } from 'src/auth/guard';
import { AppointmentDto } from './dto';
import { CheckRoleService } from 'src/common/checkRole.service';
import { User } from 'src/user/decorator';
import { AuthUser } from 'src/auth/interface';

@UseGuards(AuthGuard)
@Controller('appointments')
export class AppointmentController {

    constructor(
        private appointmentService: AppointmentService,
        private checkRoleService: CheckRoleService
    ) { }

    @Post("/")
    createAppointment(@Body() dto: AppointmentDto, @User() user: AuthUser) {
        this.checkRoleService.checkIsPatient(user.role)
        return this.appointmentService.createAppointment(dto)
    }

    @Get("/")
    getAllAppointments(@User() user: AuthUser) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.appointmentService.getAllAppointments()
    }

    @Get("/:id")
    getAnAppointment(@Param('id') id: string) {
        return this.appointmentService.getAnAppointment(id)
    }

    @Put("/:id")
    updateAppointment(@Body() dto: AppointmentDto, @Param('id') id: string, @User() user: AuthUser) {
        this.checkRoleService.checkIsPatient(user.role)
        return this.appointmentService.updateAppointment(dto, id)
    }

    @Delete("/:id")
    deleteAppointment(@Param('id') id: string, @User() user: AuthUser) {
        return this.appointmentService.deleteAppointment(id)
    }
}
