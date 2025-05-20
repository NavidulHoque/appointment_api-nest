import { Method, Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateAppointmentDto {
    @IsString()
    @IsOptional()
    doctorId?: string;

    @Type(() => Date)
    @IsDate({ message: 'Date must be a valid date' })
    @IsOptional()
    date?: Date;

    @IsString()
    @IsEnum(Status, { message: 'Status must be pending, completed, running or cancelled' })
    @IsOptional()
    status?: Status;

    @IsBoolean()
    @IsOptional()
    isPaid?: boolean;

    @IsString()
    @IsEnum(Method, { message: 'Payment method must be cash or online' })
    @IsOptional()
    paymentMethod?: Method;
}
