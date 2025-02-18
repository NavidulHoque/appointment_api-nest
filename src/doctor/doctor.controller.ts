import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard';
import { DoctorService } from './doctor.service';

@UseGuards(AuthGuard)
@Controller('doctors')
export class DoctorController {

    constructor(private doctorService: DoctorService) { }

    @Post("/")
    createDoctor() {
        this.doctorService.createDoctor()
    }

    @Get("/")
    getAllDoctors() {
        this.doctorService.getAllDoctors()
    }

    @Get("/:id")
    getADoctor() {
        this.doctorService.getADoctor()
    }

    @Put("/:id")
    updateDoctor() {
        this.doctorService.updateDoctor()
    }

    @Delete("/:id")
    deleteDoctor() {
        this.doctorService.deleteDoctor()
    }
}
