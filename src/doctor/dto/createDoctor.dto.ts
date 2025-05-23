import { IsString, IsNumber, Min, MinLength, IsArray, ArrayNotEmpty, IsNotEmpty, Matches, IsEmail } from 'class-validator';

export class CreateDoctorDto {
    @IsString()
    @MinLength(5, { message: 'Full name must be at least 5 characters long' })
    @Matches(/^[a-zA-Z. ]+$/, {
        message: 'Full name can only contain letters, spaces, and dots',
    })
    fullName: string;

    @IsString()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*\d)(?=.*[\W_]).{8,}$/, {
        message:
            'Password must contain at least one number and one special character',
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    specialization: string;

    @IsString()
    @IsNotEmpty()
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
