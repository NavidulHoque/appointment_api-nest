import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @Type(() => Date)
  @IsDate({ message: 'Date must be a valid date' })
  date: Date;
}
