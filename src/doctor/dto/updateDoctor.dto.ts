import { IsOptional, IsString, IsEnum, IsDate } from 'class-validator';
import { CreateDoctorDto } from './createDoctor.dto';
import { PartialType } from '@nestjs/mapped-types';
import { Gender } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    @IsEnum(Gender, { message: 'Gender must be male, female or other' })
    @Transform(({ value }) => value.toUpperCase())
    gender?: Gender;

    @Type(() => Date)
    @IsDate({ message: 'Date must be a valid date' })
    birthDate?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
    })
    isActive?: boolean;
}

