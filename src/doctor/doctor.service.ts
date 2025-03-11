import { Inject, Injectable } from '@nestjs/common';
import { DoctorDto } from './dto';
import { Doctor_MODEL } from './schema';
import { Model } from 'mongoose';
import { Doctor } from './interface';
import { ValidationIdService } from 'src/common/validationId.service';
import { HandleErrorsService } from 'src/common/handleErrors.service';

@Injectable()
export class DoctorService {

    constructor(
        @Inject(Doctor_MODEL)
        private doctorModel: Model<Doctor>,
        private validationIdService: ValidationIdService,
        private handleErrorsService: HandleErrorsService
    ) { }

    async createDoctor(dto: DoctorDto) {

        const { name, specialization, experience, contact, workingHours, isActive } = dto

        try {

            const doctor = await this.doctorModel.findOne({ 'contact.email': contact.email })

            if (doctor) {
                this.handleErrorsService.throwBadRequestError("Email already exists")
            }

            await this.doctorModel.create({ name, specialization, experience, contact, workingHours, isActive })

            return {
                doctor,
                message: "Doctor created successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async getAllDoctors() {

        try {

            const doctors = await this.doctorModel.find({})

            return {
                doctors
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async getADoctor(id: string) {

        try {

            await this.validationIdService.validateId(id, this.doctorModel, "Doctor")

            const doctor = await this.doctorModel.findById(id)

            return {
                doctor
            }

        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async updateDoctor(dto: DoctorDto, id: string) {

        const { name, specialization, experience, contact, workingHours, isActive } = dto

        try {
            await this.validationIdService.validateId(id, this.doctorModel, "Doctor")

            const doctor = await this.doctorModel.findByIdAndUpdate(id, { name, specialization, experience, contact, workingHours, isActive }, { new: true, runValidators: true })

            return {
                doctor,
                message: "Doctor updated successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }

    async deleteDoctor(id: string) {

        try {
            await this.validationIdService.validateId(id, this.doctorModel, "Doctor")

            await this.doctorModel.findByIdAndDelete(id)

            return {
                message: "Doctor deleted successfully"
            }
        }

        catch (error) {
            this.handleErrorsService.handleError(error)
        }
    }
}
