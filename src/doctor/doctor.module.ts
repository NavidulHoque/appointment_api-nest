import { Module, forwardRef } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { doctorsProviders } from './providers';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [DatabaseModule, ConfigModule, forwardRef(() => AppointmentModule)],
  controllers: [DoctorController],
  providers: [...doctorsProviders, DoctorService],
  exports: [...doctorsProviders]
})
export class DoctorModule {}
