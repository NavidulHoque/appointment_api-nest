import { IsString, IsNumber, Min, MinLength, IsArray, ArrayNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class UpdateDoctorDto {
    @IsString()
    @IsOptional()
    specialization?: string;

    @IsString()
    @MinLength(5, { message: 'Education must be at least 5 characters long' })
    @IsOptional()
    education?: string;

    @IsNumber()
    @Min(1, { message: 'Experience must be at least 1 year' })
    @IsOptional()
    experience?: number;

    @IsString()
    @MinLength(10, { message: 'About me must be at least 10 characters long' })
    @IsOptional()
    aboutMe?: string;

    @IsNumber()
    @Min(20, { message: 'Fees must be at least 20' })
    @IsOptional()
    fees?: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @IsOptional()
    availableTimes?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

