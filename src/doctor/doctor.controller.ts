import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard';
import { DoctorService } from './doctor.service';
import { DoctorDto } from './dto';
import { CheckRoleService } from 'src/common/checkRole.service';
import { User } from 'src/user/decorator';
import { AuthUser } from 'src/auth/interface';

@UseGuards(AuthGuard)
@Controller('doctors')
export class DoctorController {

    constructor(
        private doctorService: DoctorService,
        private checkRoleService: CheckRoleService
    ) { }

    @Post("/")
    createDoctor(@Body() dto: DoctorDto, @User() user: AuthUser) {
        this.checkRoleService.checkIsDoctor(user.role)
        return this.doctorService.createDoctor(dto)
    }

    @Get("/")
    getAllDoctors(@User() user: AuthUser) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.doctorService.getAllDoctors()
    }

    @Get("/:id")
    getADoctor(@Param('id') id: string) {
        return this.doctorService.getADoctor(id)
    }

    @Put("/:id")
    updateDoctor(@Body() dto: DoctorDto, @Param('id') id: string, @User() user: AuthUser) {
        this.checkRoleService.checkIsDoctor(user.role)
        return this.doctorService.updateDoctor(dto, id)
    }

    @Delete("/:id")
    deleteDoctor(@Param('id') id: string, @User() user: AuthUser) {
        this.checkRoleService.checkIsAdmin(user.role)
        return this.doctorService.deleteDoctor(id)
    }
}
