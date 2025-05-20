import { IsString, IsNumber, Min, MinLength, IsArray, ArrayNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class UpdateDoctorDto {
    @IsOptional()
    @IsString()
    specialization?: string;

    @IsOptional()
    @IsString()
    @MinLength(5, { message: 'Education must be at least 5 characters long' })
    education?: string;

    @IsOptional()
    @IsNumber()
    @Min(1, { message: 'Experience must be at least 1 year' })
    experience?: number;

    @IsOptional()
    @IsString()
    @MinLength(10, { message: 'About me must be at least 10 characters long' })
    aboutMe?: string;

    @IsOptional()
    @IsNumber()
    @Min(20, { message: 'Fees must be at least 20' })
    fees?: number;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    availableTimes?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

