import { Method, Status } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateAppointmentDto {
    @IsOptional()
    @IsString()
    doctorId?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'Date must be a valid date' })
    date?: Date;

    @IsOptional()
    @IsString()
    @IsEnum(Status, { message: 'Status must be pending, completed, running or cancelled' })
    status?: Status;
    
    @IsOptional()
    @IsBoolean()
    isPaid?: boolean;

    @IsOptional()
    @IsString()
    @IsEnum(Method, { message: 'Payment method must be cash or online' })
    paymentMethod?: Method;
}
