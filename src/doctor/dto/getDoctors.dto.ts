import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetDoctorsDto {
    @Type(() => Number)
    @IsInt()
    @Min(1, { message: 'Page must be at least 1' })
    @IsOptional()
    page?: number;

    @Type(() => Number)
    @IsInt()
    @Max(10, { message: 'Limit must be at most 10' })
    @IsOptional()
    limit?: number;

    @IsOptional()
    @IsString()
    specialization?: string;

    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.split('').map(Number) : value
    )
    experience?: number[];

    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.split('').map(Number) : value
    )
    fees?: number[];

    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.split('&') : value
    )
    weeks?: string[];

    @Type(() => Boolean)
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    search?: string;
}
