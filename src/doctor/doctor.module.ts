import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { doctorsProviders } from './providers';


@Module({
  controllers: [DoctorController],
  providers: [...doctorsProviders, DoctorService],
  exports: [...doctorsProviders]
})
export class DoctorModule {}
