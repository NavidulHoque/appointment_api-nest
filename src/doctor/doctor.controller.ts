import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard';
import { DoctorService } from './doctor.service';
import { DoctorDto } from './dto';

@UseGuards(AuthGuard)
@Controller('doctors')
export class DoctorController {

    constructor(private doctorService: DoctorService) { }

    @Post("/")
    createDoctor(@Body() dto: DoctorDto) {
        return this.doctorService.createDoctor(dto)
    }

    @Get("/")
    getAllDoctors() {
        return this.doctorService.getAllDoctors()
    }

    @Get("/:id")
    getADoctor(@Param('id') id: string) {
        return this.doctorService.getADoctor(id)
    }

    @Put("/:id")
    updateDoctor(@Body() dto: DoctorDto, @Param('id') id: string) {
        return this.doctorService.updateDoctor(dto, id)
    }

    @Delete("/:id")
    deleteDoctor(@Param('id') id: string) {
        return this.doctorService.deleteDoctor(id)
    }
}
