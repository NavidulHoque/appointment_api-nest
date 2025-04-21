import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorDto } from './dto';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoctorService {

    constructor(
        private prisma: PrismaService,
        private handleErrorsService: HandleErrorsService
    ) { }

    async createDoctor(dto: DoctorDto) {

        const { userId, specialization, education, experience, aboutMe, fees, availableTimes } = dto

        try {
            const newDoctor = await this.prisma.doctor.create({
                data: { userId, specialization, education, experience, aboutMe, fees, availableTimes }
            })

            return {
                doctor: newDoctor,
                message: "Doctor created successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async getAllDoctors() {

        try {
            const doctors = await this.prisma.doctor.findMany()

            return {
                doctors
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async getAllDoctorsBySpecialization() {

    }

    //also send other related doctors in the response
    async getADoctor(id: string) {

        try {

            const doctor = await this.prisma.doctor.findUnique({ where: { id } })

            if (!doctor) {
                this.handleErrorsService.throwNotFoundError("Doctor not found")
            }

            return {
                doctor
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async allPatients(){
        
    }

    async updateDoctor(dto: DoctorDto, id: string) {

        const { specialization, education, experience, aboutMe, fees } = dto

        try {

            const doctor = await this.prisma.doctor.update({
                where: { id },
                data: { specialization, education, experience, aboutMe, fees }
            })

            if (!doctor) {
                this.handleErrorsService.throwNotFoundError("Doctor not found")
            }

            return {
                doctor,
                message: "Doctor updated successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async addAvailableTimes(){

    }

    async makeDoctorActive(){

    }

    async makeDoctorInactive(){

    }

    async deleteDoctor(id: string) {

        try {
            const doctor = await this.prisma.doctor.delete({ where: { id } })

            if (!doctor) {
                this.handleErrorsService.throwNotFoundError("Doctor not found")
            }

            return {
                message: "Doctor deleted successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }
}
