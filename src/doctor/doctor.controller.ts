import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
        console.log(user?.role);
        this.checkRoleService.checkIsAdmin(user.role)
        return this.doctorService.createDoctor(dto)
    }

    @Get("/get-all-doctors")
    getAllDoctors() {
        return this.doctorService.getAllDoctors()
    }

    @Get("/get-all-doctors-specialization")
    getAllDoctorsBySpecialization() {
        return this.doctorService.getAllDoctorsBySpecialization()
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
