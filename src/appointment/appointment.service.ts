import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Appointment_MODEL } from './schema';
import mongoose, { Model } from 'mongoose';
import { Appointment } from './interface';
import { AppointmentDto } from './dto';
import { Doctor_MODEL } from 'src/doctor/schema';
import { Doctor } from 'src/doctor/interface';

@Injectable()
export class AppointmentService {

    constructor(
        @Inject(Appointment_MODEL)
        private appointmentModel: Model<Appointment>,
        @Inject(Doctor_MODEL)
        private doctorModel: Model<Doctor>
    ) { }

    async createAppointment(dto: AppointmentDto) {

        const { patientName, contactInformation, date, time, doctorId } = dto

        try {
            const doctor = mongoose.Types.ObjectId.isValid(doctorId) && await this.doctorModel.findById(doctorId)

            if (!doctor) {
                this.throwNotFoundError("Doctor not Found")
            }

            const appointment = await this.appointmentModel.create({ patientName, contactInformation, date, time, doctorId })

            const populatedAppointment = await appointment.populate("doctorId")

            const { _id, doctorId: { name, specialization, experience, contact, workingHours, isActive } } = populatedAppointment

            return {
                appointment: {
                    id: _id,
                    patientName,
                    contactInformation,
                    date,
                    time,
                    doctor: {
                        id: doctorId,
                        name,
                        specialization,
                        experience,
                        contact,
                        workingHours,
                        isActive
                    }
                },
                message: "Appointment created successfully"
            }
        }

        catch (error) {

        }

    }

    async getAllAppointments() {

        try {
            const appointments = await this.appointmentModel.find()
                .populate("doctorId")
                .lean() // Convert the document to a plain JavaScript object which optimizes the performance

            const formattedAppointments = appointments.map(({ _id, patientName, contactInformation, date, time, doctorId: {_id: id, name, specialization, experience, contact, workingHours, isActive} }) => ({
                id: _id,
                patientName,
                contactInformation,
                date,
                time,
                doctor: {
                    id,
                    name,
                    specialization,
                    experience,
                    contact,
                    workingHours,
                    isActive
                },
            }));

            return {
                appointments: formattedAppointments
            }
        }

        catch (error) {

        }

    }

    async getAnAppointment(id: string) {

        try {

            const appointment = await this.appointmentModel.findById(id)
                .populate("doctorId")
                .lean()

            if (!appointment) {
                this.throwNotFoundError('Appointment not found')
            }

            const { patientName, contactInformation, date, time, doctorId: { _id, name, specialization, experience, contact, workingHours, isActive } } = appointment as any

            return {
                appointment: { id, patientName, contactInformation, date, time, doctor: { id: _id, name, specialization, experience, contact, workingHours, isActive } }
            }
        }

        catch (error) {

        }

    }

    async updateAppointment(dto: AppointmentDto, id: string) {

        const { patientName, contactInformation, date, time, doctorId } = dto

        try {
            const appointment = await this.appointmentModel.findByIdAndUpdate(id, {
                patientName,
                contactInformation,
                date,
                time,
                doctorId
            },
                { new: true, runValidators: true })

            const populatedAppointment = appointment && await appointment.populate("doctorId", "name")

            const { doctorId: { name, specialization, experience, contact, workingHours, isActive } } = populatedAppointment as any

            return {
                appointment: {
                    id,
                    patientName,
                    contactInformation,
                    date,
                    time,
                    doctor: {
                        id: doctorId,
                        name, 
                        specialization, 
                        experience, 
                        contact, 
                        workingHours, 
                        isActive
                    }
                },
                message: "Appointment updated successfully"
            }
        }

        catch (error) {

        }

    }

    async deleteAppointment(id: string) {

        try {
            const appointment = mongoose.Types.ObjectId.isValid(id) && await this.appointmentModel.findById(id)

            if (!appointment) {
                this.throwNotFoundError("Appointment not found")
            }

            await this.appointmentModel.findByIdAndDelete(id)

            return {
                message: "Appointment deleted successfully"
            }
        }

        catch (error) {

        }
    }

    private throwNotFoundError(message: string) {
        throw new NotFoundException(message)
    }

    private async validateId(id: string, model: any, entityName: string) {

        try {
            const entity = mongoose.Types.ObjectId.isValid(id) && await model.findById(id)
    
            if (!entity) {
                return { 
                    message: `${entityName} not found` 
                }
            }
    
            
        } 
        
        catch (error) {
            
        }
    };
}
