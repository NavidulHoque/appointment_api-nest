import { Document } from 'mongoose';

export interface Doctor extends Document {
    name: string;
    specialization: string;
    experience: number;
    contact: {phone: string, email: string};
    workingHours: {start: string, end: string};
    isActive: boolean;
    readonly createdAt: Date;
    updatedAt: Date;
}