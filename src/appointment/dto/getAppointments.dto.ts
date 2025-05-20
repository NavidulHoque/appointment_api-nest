// filter-appointments.dto.ts
import { IsEnum, IsOptional, IsBoolean, IsInt, Min, Max, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Method, Status } from '@prisma/client';

export class GetAppointmentsDto {

  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Page must be at least 1' })
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsInt()
  @Max(10, { message: 'Limit must be at most 10' })
  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsString()
  @IsOptional()
  doctorId?: string;

  @IsString()
  @IsOptional()
  patientId?: string;
  
  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(Status, { message: 'Status must be pending, completed, running or cancelled' })
  @IsOptional()
  status?: Status;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(Method, { message: 'Payment method must be cash or online' })
  @IsOptional()
  paymentMethod?: string;
}
