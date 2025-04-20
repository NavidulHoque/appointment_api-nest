import { Module } from '@nestjs/common';
import { HandleErrorsService } from './handleErrors.service';
import { CheckRoleService } from './checkRole.service';
import { FetchUserService } from './fetchUser.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [HandleErrorsService, CheckRoleService, FetchUserService],
  exports: [HandleErrorsService, CheckRoleService, FetchUserService]
})
export class CommonModule { }
