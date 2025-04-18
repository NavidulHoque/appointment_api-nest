import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { PatientModule } from './patient/patient.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, AppointmentModule, DoctorModule, CommonModule, PatientModule, PrismaModule],
  controllers: [AppController]
})
export class AppModule { }
