import { IsString, IsNumber, Min, MinLength, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateDoctorDto {
    @IsString()
    userId: string;

    @IsString()
    specialization: string;

    @IsString()
    @MinLength(5, { message: 'Education must be at least 5 characters long' })
    education: string;

    @IsNumber()
    @Min(1, { message: 'Experience must be at least 1 year' })
    experience: number;

    @IsString()
    @MinLength(10, { message: 'About me must be at least 10 characters long' })
    aboutMe: string;

    @IsNumber()
    @Min(20, { message: 'Fees must be at least 20' })
    fees: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    availableTimes: string[];
}
