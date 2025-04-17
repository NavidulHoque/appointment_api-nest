import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsDate,
    MinLength,
    Matches,
    IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Role, Gender } from '@prisma/client';

export class UserDto {
    @IsString()
    @MinLength(5, { message: 'Full name must be at least 5 characters long' })
    @Matches(/^[a-zA-Z. ]+$/, {
        message: 'Full name can only contain letters, spaces, and dots',
    })
    fullName: string;

    @IsString()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsEnum(Role, { message: 'Role must be patient, doctor or admin' })
    role: Role;

    @IsString()
    @IsOptional()
    @Matches(/^\d{11}$/, {
        message: 'Phone number must be exactly 11 digits',
    })
    phone?: string;

    @IsOptional()
    @IsEnum(Gender, { message: 'Gender must be male, female or other' })
    gender?: Gender;

    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: 'Birth Date must be a valid date' })
    birthDate?: Date;

    @IsString()
    @IsOptional()
    @MinLength(5, { message: 'Address must be at least 5 characters long' })
    address?: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*\d)(?=.*[\W_]).{8,}$/, {
        message:
            'Password must contain at least one number and one special character',
    })
    password: string;
}
