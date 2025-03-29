import { Document } from 'mongoose';

export interface User extends Document {
  username: string;
  fullName: string;
  phone: string;
  email: string;
  role: string;
  password: string;
  readonly createdAt: Date;
  updatedAt: Date;
}