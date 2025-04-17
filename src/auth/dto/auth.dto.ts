import {
    IsEmail,
    IsEnum,
    MinLength,
    Matches,
    IsString,
    IsOptional,
} from 'class-validator';
import { Role } from '@prisma/client';

export class AuthDto {
    @IsString()
    @MinLength(5, { message: 'Full name must be at least 5 characters long' })
    @Matches(/^[a-zA-Z. ]+$/, {
        message: 'Full name can only contain letters, spaces, and dots',
    })
    fullName: string;

    @IsString()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsOptional()
    @IsEnum(Role, { message: 'Role must be patient, doctor or admin' })
    role?: Role;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*\d)(?=.*[\W_]).{8,}$/, {
        message:
            'Password must contain at least one number and one special character',
    })
    password: string;
}
