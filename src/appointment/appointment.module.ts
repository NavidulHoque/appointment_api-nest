import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { ConfigModule } from '@nestjs/config';
import { DoctorModule } from 'src/doctor/doctor.module';
import { CommonModule } from 'src/common/common.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ConfigModule, DoctorModule, CommonModule, PrismaModule],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule { }
