/* eslint-disable prettier/prettier */

import { Connection } from 'mongoose';
import { UserSchema } from '../schema'; 
import { USER_MODEL } from '../schema';

export const usersProviders = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];