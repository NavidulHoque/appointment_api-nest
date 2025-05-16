import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard';
import { DoctorService } from './doctor.service';
import { DoctorDto } from './dto';
import { CheckRoleService } from 'src/common/checkRole.service';
import { User } from 'src/user/decorator';
import { AuthUser } from 'src/auth/interface';
import { UserDto } from 'src/user/dto';

@UseGuards(AuthGuard)
@Controller('doctors')
export class DoctorController {

    constructor(
        private doctorService: DoctorService,
        private checkRoleService: CheckRoleService
    ) { }

    @Post("/create-doctor")
    createDoctor(@Body() dto: DoctorDto, @User() user: UserDto) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.doctorService.createDoctor(dto)
    }

    @Get("/get-all-doctors")
    getAllDoctors(
        @User() user: UserDto,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('specialization') specialization: string,
        @Query('education') education: string,
        @Query('experience', new ParseArrayPipe({ items: Number, separator: ',', optional: true }))
        experience: number[],

        @Query('fees', new ParseArrayPipe({ items: Number, separator: ',', optional: true }))
        fees: number[],

        @Query('weeks', new ParseArrayPipe({ items: String, separator: ',', optional: true }))
        weeks: string[],

        @Query('isActive') isActive: boolean,
        @Query('search') search: string,
    ) {
        this.checkRoleService.checkIsAdminOrPatient(user.role)
        return this.doctorService.getAllDoctors(page, limit, specialization, education, experience, weeks,fees, isActive, search)
    }

    @Get("/get-a-doctor/:id")
    getADoctor(@Param('id') id: string) {
        return this.doctorService.getADoctor(id)
    }

    @Get("/get-all-patients/:doctorId")
    allPatients() {
        return this.doctorService.allPatients()
    }

    @Patch("/update-doctor/:id")
    updateDoctor(@Body() dto: DoctorDto, @Param('id') id: string, @User() user: AuthUser) {
        this.checkRoleService.checkIsDoctor(user.role)
        return this.doctorService.updateDoctor(dto, id)
    }

    @Patch("/update-add-available-times/:id")
    addAvailableTimes() {
        this.doctorService.addAvailableTimes()
    }

    @Patch("/update-make-doctor-active/:id")
    makeDoctorActive() {
        this.doctorService.makeDoctorActive()
    }

    @Patch("/update-make-doctor-inactive/:id")
    makeDoctorInActive() {
        this.doctorService.makeDoctorInactive()
    }

    @Delete("/delete-doctor/:id")
    deleteDoctor(@Param('id') id: string, @User() user: AuthUser) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.doctorService.deleteDoctor(id)
    }
}
