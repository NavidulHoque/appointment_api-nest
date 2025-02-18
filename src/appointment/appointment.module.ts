import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { appointmentsProviders } from './providers';

@Module({
  providers: [AppointmentService, ...appointmentsProviders],
  exports: [...appointmentsProviders],
  controllers: [AppointmentController]
})
export class AppointmentModule {}
