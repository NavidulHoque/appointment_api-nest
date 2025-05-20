import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto, GetDoctorsDto } from './dto';
import { CheckRoleService } from 'src/common/checkRole.service';
import { User } from 'src/user/decorator';
import { UserDto } from 'src/user/dto';

@UseGuards(AuthGuard)
@Controller('doctors')
export class DoctorController {

    constructor(
        private doctorService: DoctorService,
        private checkRoleService: CheckRoleService
    ) { }

    @Post("/create-doctor")
    createDoctor(
        @Body() dto: CreateDoctorDto,
        @User() user: UserDto
    ) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.doctorService.createDoctor(dto)
    }

    @Get("/get-all-doctors")
    getAllDoctors(
        @User() user: UserDto,
        @Query() query: GetDoctorsDto
    ) {
        this.checkRoleService.checkIsAdminOrPatient(user.role)
        return this.doctorService.getAllDoctors(query)
    }

    @Get("/get-a-doctor/:id")
    getADoctor(
        @Param('id') id: string,
        @User() user: UserDto,
        @Query() query: GetDoctorsDto,
    ) {
        this.checkRoleService.checkIsAdminOrPatient(user.role)
        return this.doctorService.getADoctor(id, query)
    }

    @Get("/get-total-revenue")
    getTotalRevenue(
        @User() user: UserDto,
    ) {
        this.checkRoleService.checkIsDoctor(user.role)
        return this.doctorService.getTotalRevenue(user)
    }

    @Patch("/update-doctor")
    updateDoctor(
        @Body() body: any,
        @Param('id') id: string,
        @User() user: UserDto
    ) {
        this.checkRoleService.checkIsDoctor(user.role)
        return this.doctorService.updateDoctor(body, id)
    }

    @Patch("/update-add-available-times/:id")
    addAvailableTime(
        @Body('availableTime') availableTime: string,
        @Param('id') id: string,
        @User() user: UserDto
    ) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.doctorService.addAvailableTime(id, availableTime)
    }

    @Patch("/update-remove-available-times/:id")
    removeAvailableTime(
        @Body('availableTime') availableTime: string,
        @Param('id') id: string,
        @User() user: UserDto
    ) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.doctorService.removeAvailableTime(id, availableTime)
    }


    @Patch("/update-make-doctor-active/:id")
    makeDoctorActive(
        @Param('id') id: string,
        @User() user: UserDto
    ) {
        this.checkRoleService.checkIsAdminOrDoctor(user.role)
        return this.doctorService.makeDoctorActive(id)
    }

    @Patch("/update-make-doctor-inactive/:id")
    makeDoctorInActive(
        @Param('id') id: string,
        @User() user: UserDto
    ) {
        this.checkRoleService.checkIsAdminOrDoctor(user.role)
        return this.doctorService.makeDoctorInactive(id)
    }

    @Delete("/delete-doctor/:id")
    deleteDoctor(
        @Param('id') id: string,
        @User() user: UserDto
    ) {
        this.checkRoleService.checkIsAdminOrDoctor(user.role)
        return this.doctorService.deleteDoctor(id)
    }
}
