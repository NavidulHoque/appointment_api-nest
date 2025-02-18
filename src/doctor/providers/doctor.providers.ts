import { Connection } from 'mongoose';
import { DoctorSchema } from '../schema'; 
import { Doctor_MODEL } from '../schema';

export const doctorsProviders = [
  {
    provide: Doctor_MODEL,
    useFactory: (connection: Connection) => connection.model('Doctor', DoctorSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];