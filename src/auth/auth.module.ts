import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [UserModule, ConfigModule, CommonModule, JwtModule.register({
    global: true,
  })],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
