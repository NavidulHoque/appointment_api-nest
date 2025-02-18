import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { usersProviders } from './providers'; 
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';

@Module({
    imports: [DatabaseModule, ConfigModule],
    providers: [...usersProviders],
    exports: [...usersProviders],
    controllers: [UserController]
})
export class UserModule { }
