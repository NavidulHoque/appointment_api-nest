import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { appointmentsProviders } from './providers';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { DoctorModule } from 'src/doctor/doctor.module';

@Module({
  imports: [DatabaseModule, ConfigModule, DoctorModule],
  controllers: [AppointmentController],
  providers: [...appointmentsProviders, AppointmentService],
  exports: [...appointmentsProviders]
})
export class AppointmentModule {}
