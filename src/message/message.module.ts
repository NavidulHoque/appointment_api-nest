import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { CommonModule } from 'src/common/common.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CommonModule, PrismaModule, ConfigModule],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
