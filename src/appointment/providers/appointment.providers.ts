import { Connection } from 'mongoose';
import { AppointmentSchema } from '../schema'; 
import { Appointment_MODEL } from '../schema';

export const appointmentsProviders = [
  {
    provide: Appointment_MODEL,
    useFactory: (connection: Connection) => connection.model('Appointment', AppointmentSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];