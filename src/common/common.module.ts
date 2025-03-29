import { Module } from '@nestjs/common';
import { ValidationIdService } from './validationId.service';
import { HandleErrorsService } from './handleErrors.service';
import { CheckRoleService } from './checkRole.service';

@Module({
  providers: [ValidationIdService, HandleErrorsService, CheckRoleService],
  exports: [ValidationIdService, HandleErrorsService, CheckRoleService]
})
export class CommonModule { }
