import { Module, forwardRef } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { doctorsProviders } from './providers';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [DatabaseModule, ConfigModule, forwardRef(() => AppointmentModule), CommonModule],
  controllers: [DoctorController],
  providers: [...doctorsProviders, DoctorService],
  exports: [...doctorsProviders]
})
export class DoctorModule { }
