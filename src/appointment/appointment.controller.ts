import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
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

    //admin dashboard
    @Get("/admin/get-all-appointments")
    getAllAppointments(
        @User() user: AuthUser,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('search') search: string,
        @Query('status') status: string,
        @Query('paymentMethod') paymentMethod: string,
    ) {
        this.checkRoleService.checkIsAdminOrDoctor(user.role)
        return this.appointmentService.getAllAppointments(page, limit, search, status, paymentMethod)
    }

    @Get("/admin/get-total-appointment-count")
    getTotalAppointmentCount(@User() user: AuthUser) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.appointmentService.getTotalAppointmentCount()
    }

    @Get("/admin/get-total-appointments-graph")
    getTotalAppointmentsGraph(@User() user: AuthUser) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.appointmentService.getTotalAppointmentsGraph()
    }

    //patient dashboard
    @Get("/patient/get-appointments-graph-patient")
    getAppointmentsGraphOfPatient(@User() user: AuthUser) {
        this.checkRoleService.checkIsPatient(user.role)
        return this.appointmentService.getAppointmentsGraphOfPatient()
    }

    //doctor dashboard
    @Get("/doctor/get-total-appointments-count-doctor")
    getTotalAppointmentsCountOfDoctor(@User() user: AuthUser) {
        this.checkRoleService.checkIsDoctor(user.role)
        return this.appointmentService.getTotalAppointmentsCountOfDoctor()
    }

    @Get("/doctor/get-all-appointments-today-doctor")
    getAllAppointmentsTodayOfDoctor(@User() user: AuthUser) {
        this.checkRoleService.checkIsDoctor(user.role)
        return this.appointmentService.getAllAppointmentsTodayOfDoctor()
    }

    @Get("/doctor/get-appointments-graph-doctor")
    getAppointmentsGraphOfDoctor(@User() user: AuthUser) {
        this.checkRoleService.checkIsDoctor(user.role)
        return this.appointmentService.getAppointmentsGraphOfDoctor()
    }

    //both
    @Post("/create-appointment")
    createAppointment(@Body() dto: AppointmentDto) {
        return this.appointmentService.createAppointment(dto)
    }

    @Get("/get-an-appointment/:id")
    getAnAppointment(@Param('id') id: string) {
        return this.appointmentService.getAnAppointment(id)
    }

    @Get("/get-all-patients/:doctorId")
    getAllPatients() {
        return this.appointmentService.getAllPatients()
    }

    @Put("/update-appointment/:id")
    updateAppointment(@Body() dto: AppointmentDto, @Param('id') id: string) {
        return this.appointmentService.updateAppointment(dto, id)
    }

    @Patch("/update-appointment-status/:id")
    updateAppointmentStatus(@Body() dto: AppointmentDto, @Param('id') id: string) {
        return this.appointmentService.updateAppointmentStatus()
    }

    @Delete("/delete-appointment/:id")
    deleteAppointment(@Param('id') id: string) {
        return this.appointmentService.deleteAppointment(id)
    }
}
