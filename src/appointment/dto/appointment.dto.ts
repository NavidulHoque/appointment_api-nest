import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { Status } from '@prisma/client';

export class AppointmentDto {

    @IsString()
    patientId: string;

    @IsString()
    doctorId: string;

    @Type(() => Date)
    @IsDate({ message: 'Date must be a valid date' })
    date: Date;

    @IsString()
    @IsOptional()
    @IsEnum(Status, { message: 'Status must be pending, completed or cancelled' })
    status?: Status;

    @IsBoolean()
    @IsOptional()
    isPaid?: boolean;

    @IsString()
    @IsOptional()
    paymentMethod?: string;

    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean;
}