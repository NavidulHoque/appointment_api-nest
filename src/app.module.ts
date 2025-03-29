import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DoctorModule } from './doctor/doctor.module';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, AppointmentModule, DoctorModule, DatabaseModule, CommonModule, PatientModule],
  controllers: [AppController]
})
export class AppModule {}
