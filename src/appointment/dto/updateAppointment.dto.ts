import { Method, Status } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateAppointmentDto {
    @IsOptional()
    @IsString()
    @IsEnum(Status, { message: 'Status must be pending, completed, running or cancelled' })
    @Transform(({ value }) => value.toUpperCase())
    status?: Status;

    @IsOptional()
    @IsBoolean()
    isPaid?: boolean;

    @IsOptional()
    @IsString()
    @IsEnum(Method, { message: 'Payment method must be cash or online' })
    @Transform(({ value }) => value.toUpperCase())
    paymentMethod?: Method;

    @IsOptional()
    @IsString()
    cancellationReason?: string;
}
