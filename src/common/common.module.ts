import { Module } from '@nestjs/common';
import { ValidationIdService } from './validationId.service';
import { HandleErrorsService } from './handleErrors.service';
import { CheckRoleService } from './checkRole.service';
import { FetchUserService } from './fetchUser.service';

@Module({
  providers: [ValidationIdService, HandleErrorsService, CheckRoleService, FetchUserService],
  exports: [ValidationIdService, HandleErrorsService, CheckRoleService, FetchUserService]
})
export class CommonModule { }
