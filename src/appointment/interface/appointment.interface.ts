import { Document, Types } from 'mongoose';

export interface Appointment extends Document {
    patientName: string;
    contactInformation: {phone: string, email: string};
    date: string;
    time: string;
    readonly doctorId: Types.ObjectId;
}