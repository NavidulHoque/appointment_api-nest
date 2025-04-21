import {
    IsString,
    IsNumber,
    IsBoolean,
    IsOptional,
    Min,
    MinLength,
    Matches,
} from 'class-validator';

export class DoctorDto {
    @IsString()
    userId: string;

    @IsString()
    specialization: string;

    @MinLength(5, { message: 'Education must be at least 5 characters long' })
    @Matches(/^[a-zA-Z., ]+$/, {
        message:
            'Education can only contain letters, spaces, dots, and commas',
    })
    education: string;

    @IsNumber()
    @Min(1, { message: 'Experience must be at least 1 year' })
    experience: number;

    @MinLength(10, { message: 'About me must be at least 10 characters long' })
    @Matches(/^[a-zA-Z0-9., ]+$/, {
        message:
            'About me can only contain alphanumeric characters, spaces, dots and commas',
    })
    aboutMe: string;

    @IsNumber()
    @Min(20, { message: 'Fees must be at least 20' })
    fees: number;

    availableTimes: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
