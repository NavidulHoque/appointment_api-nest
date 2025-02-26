import { Module } from '@nestjs/common';
import { ValidationIdService } from './validationId.service';
import { HandleErrorsService } from './handleErrors.service';

@Module({
  providers: [ValidationIdService, HandleErrorsService],
  exports: [ValidationIdService, HandleErrorsService]
})
export class CommonModule {}
