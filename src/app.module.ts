import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReviewModule } from './review/review.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, AppointmentModule, DoctorModule, CommonModule, PrismaModule, ReviewModule, MessageModule],
  controllers: [AppController]
})
export class AppModule { }
