import { IsString } from "class-validator";

export class PatientDto {
    @IsString()
    userId: string;
}