import { Inject, Injectable } from '@nestjs/common';
import { Appointment_MODEL } from './schema';
import { Model } from 'mongoose';
import { Appointment } from './interface';
import { AppointmentDto } from './dto';

@Injectable()
export class AppointmentService {

    constructor(
        @Inject(Appointment_MODEL)
        private appointmentModel: Model<Appointment>
    ){}

    async createAppointment(dto: AppointmentDto) {

        const { patientName, contactInformation, date, time, doctorId } = dto

    }

    async getAllAppointments(){

    }

    async getAnAppointment(){

    }

    async updateAppointment(dto: AppointmentDto){

        const { patientName, contactInformation, date, time, doctorId } = dto

    }

    async deleteAppointment(){

    }
}
