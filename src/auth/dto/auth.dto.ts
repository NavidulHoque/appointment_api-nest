import { Role } from '@prisma/client';
import {
    IsEmail,
    MinLength,
    Matches,
    IsString,
    IsOptional,
    IsEnum
} from 'class-validator';

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
    role?: Role | null;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*\d)(?=.*[\W_]).{8,}$/, {
        message:
            'Password must contain at least one number and one special character',
    })
    password: string;
}
