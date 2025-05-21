// filter-appointments.dto.ts
import { IsEnum, IsOptional, IsBoolean, IsInt, Min, Max, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Method, Status } from '@prisma/client';

export class GetAppointmentsDto {

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(10, { message: 'Limit must be at most 10' })
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  doctorId?: string;

  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(Status, { message: 'Status must be pending, completed, running or cancelled' })
  status?: Status;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
  })
  isPaid?: boolean;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(Method, { message: 'Payment method must be cash or online' })
  paymentMethod?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isToday?: boolean
}
