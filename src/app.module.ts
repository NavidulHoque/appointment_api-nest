/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DoctorModule } from './doctor/doctor.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller'; 

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, AppointmentModule, DoctorModule, DatabaseModule],
  controllers: [AppController],
})
export class AppModule {}
