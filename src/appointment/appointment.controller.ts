import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
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
    getAllAppointments(@User() user: AuthUser) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.appointmentService.getAllAppointments()
    }

    @Get("/admin/get-all-cancelled-appointments")
    getAllCancelledAppointments(@User() user: AuthUser) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.appointmentService.getAllCancelledAppointments()
    }

    @Get("/admin/get-all-pending-appointments")
    getAllPendingAppointments(@User() user: AuthUser) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.appointmentService.getAllPendingAppointments()
    }

    @Get("/admin/get-all-completed-appointments")
    getAllCompletedAppointments(@User() user: AuthUser) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.appointmentService.getAllCompletedAppointments()
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
    @Get("/patient/get-all-appointments-patient")
    getAllAppointmentsOfPatient(@User() user: AuthUser) {
        this.checkRoleService.checkIsPatient(user.role)
        return this.appointmentService.getAllAppointmentsOfPatient()
    }

    @Get("/patient/get-appointments-graph-patient")
    getAppointmentsGraphOfPatient(@User() user: AuthUser) {
        this.checkRoleService.checkIsPatient(user.role)
        return this.appointmentService.getAppointmentsGraphOfPatient()
    }

    //doctor dashboard
    @Get("/doctor/get-all-appointments-doctor")
    getAllAppointmentsOfDoctor(@User() user: AuthUser) {
        this.checkRoleService.checkIsDoctor(user.role)
        return this.appointmentService.getAllAppointmentsOfDoctor()
    }

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

    @Get("/doctor/get-all-cancelled-appointments-doctor")
    getAllCancelledAppointmentsOfDoctor(@User() user: AuthUser) {
        this.checkRoleService.checkIsDoctor(user.role)
        return this.appointmentService.getAllCancelledAppointmentsOfDoctor()
    }

    @Get("/doctor/get-all-pending-appointments-doctor")
    getAllPendingAppointmentsOfDoctor(@User() user: AuthUser) {
        this.checkRoleService.checkIsDoctor(user.role)
        return this.appointmentService.getAllPendingAppointmentsOfDoctor()
    }

    @Get("/doctor/get-all-completed-appointments-doctor")
    getAllCompletedAppointmentsOfDoctor(@User() user: AuthUser) {
        this.checkRoleService.checkIsDoctor(user.role)
        return this.appointmentService.getAllCompletedAppointmentsOfDoctor()
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
