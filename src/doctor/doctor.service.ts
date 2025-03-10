import { Inject, Injectable } from '@nestjs/common';
import { DoctorDto } from './dto';
import { Doctor_MODEL } from './schema';
import { Model } from 'mongoose';
import { Doctor } from './interface';
import { ValidationIdService } from 'src/common/validationId.service';

@Injectable()
export class DoctorService {

    constructor(
        @Inject(Doctor_MODEL)
        private doctorModel: Model<Doctor>,
        private validationIdService: ValidationIdService
    ){}

    async createDoctor(dto: DoctorDto){

        const {name, specialization, experience, contact, workingHours, isActive} = dto

        try {

            const doctor = await this.doctorModel.create({name, specialization, experience, contact, workingHours, isActive})

            return {
                doctor,
                message: "Doctor created successfully"
            }
        } 
        
        catch (error) {
            
        }
    }

    async getAllDoctors(){

        try {

            const doctors = await this.doctorModel.find({})

            return {
                doctors
            }
        } 
        
        catch (error) {
            
        }
    }

    async getADoctor(id: string){

        try {

            await this.validationIdService.validateId(id, this.doctorModel, "Doctor")

            const doctor = await this.doctorModel.findById(id)

            return {
                doctor
            }
            
        } 
        
        catch (error) {
            
        }
    }

    async updateDoctor(dto: DoctorDto, id: string){

        const {name, specialization, experience, contact, workingHours, isActive} = dto

        try {
            await this.validationIdService.validateId(id, this.doctorModel, "Doctor")

            const doctor = await this.doctorModel.findByIdAndUpdate(id, {name, specialization, experience, contact, workingHours, isActive}, {new: true, runValidators: true})

            return {
                doctor,
                message: "Doctor updated successfully"
            }
        } 
        
        catch (error) {
            
        }
    }

    async deleteDoctor(id: string){

        try {
            await this.validationIdService.validateId(id, this.doctorModel, "Doctor")

            await this.doctorModel.findByIdAndDelete(id)

            return {
                message: "Doctor deleted successfully"
            }
        } 
        
        catch (error) {
            
        }
    }
}
