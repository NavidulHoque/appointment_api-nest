import { Inject, Injectable } from '@nestjs/common';
import { DoctorDto } from './dto';
import { Doctor_MODEL } from './schema';
import { Model } from 'mongoose';
import { Doctor } from './interface';
import { HandleErrorsService } from 'src/common/handleErrors.service';
import { ValidationIdService } from 'src/common/validationId.service';

@Injectable()
export class DoctorService {

    constructor(
        @Inject(Doctor_MODEL)
        private doctorModel: Model<Doctor>,
        private handleErrorsService: HandleErrorsService,
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

            const doctors = await this.doctorModel.find()

            return {
                doctors,
                message: "Doctors fetched successfully"
            }
        } 
        
        catch (error) {
            
        }
    }

    async getADoctor(id: string){

        try {
            
        } 
        
        catch (error) {
            
        }
    }

    async updateDoctor(dto: DoctorDto, id: string){

        try {
            
        } 
        
        catch (error) {
            
        }
    }

    async deleteDoctor(id: string){

        try {
            
        } 
        
        catch (error) {
            
        }
    }
}
