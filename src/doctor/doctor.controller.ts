import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseBoolPipe, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard';
import { DoctorService } from './doctor.service';
import { DoctorDto } from './dto';
import { CheckRoleService } from 'src/common/checkRole.service';
import { User } from 'src/user/decorator';
import { AuthUser } from 'src/auth/interface';
import { UserDto } from 'src/user/dto';
import { ParseNumberArrayPipe } from 'src/common/pipes/parse-number-array.pipe';
import { OptionalParseBoolPipe } from 'src/common/pipes/optional-parse-bool.pipe';

@UseGuards(AuthGuard)
@Controller('doctors')
export class DoctorController {

    constructor(
        private doctorService: DoctorService,
        private checkRoleService: CheckRoleService
    ) { }

    @Post("/create-doctor")
    createDoctor(
        @Body() dto: DoctorDto, 
        @User() user: UserDto
    ) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.doctorService.createDoctor(dto)
    }

    @Get("/get-all-doctors")
    getAllDoctors(
        @User() user: UserDto,
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('specialization') specialization: string,
        @Query('experience', ParseNumberArrayPipe)
        experience: number[],

        @Query('fees', ParseNumberArrayPipe)
        fees: number[],

        @Query('weeks', new ParseArrayPipe({ items: String, separator: ',', optional: true }))
        weeks: string[],

        @Query('isActive', OptionalParseBoolPipe) isActive: boolean,
        @Query('search') search: string,
    ) {
        this.checkRoleService.checkIsAdminOrPatient(user.role)
        return this.doctorService.getAllDoctors(page, limit, specialization, experience, weeks,fees, isActive, search)
    }

    @Get("/get-a-doctor/:id")
    getADoctor(
        @Param('id') id: string,
        @User() user: UserDto,
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
    ) {
        this.checkRoleService.checkIsAdminOrPatient(user.role)
        return this.doctorService.getADoctor(id, page, limit)
    }

    @Patch("/update-doctor/:id")
    updateDoctor(
        @Body() body: any, 
        @Param('id') id: string, 
        @User() user: UserDto
    ) {
        this.checkRoleService.checkIsAdminOrDoctor(user.role)
        return this.doctorService.updateDoctor(body, id)
    }

    @Patch("/update-add-available-times/:id")
    addAvailableTime(
        @Body('availableTime') availableTime: string, 
        @Param('id') id: string, 
        @User() user: UserDto
    ) {
        this.checkRoleService.checkIsAdminOrDoctor(user.role)
        return this.doctorService.addAvailableTime(id, availableTime)
    }

    @Patch("/update-remove-available-times/:id")
    removeAvailableTime(
        @Body('availableTime') availableTime: string, 
        @Param('id') id: string, 
        @User() user: UserDto
    ) {
        this.checkRoleService.checkIsAdminOrDoctor(user.role)
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
        @User() user: AuthUser
    ) {
        this.checkRoleService.checkIsAdminOrDoctor(user.role)
        return this.doctorService.deleteDoctor(id)
    }
}
