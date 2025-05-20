import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class CreateAppointmentDto {
  @IsString()
  patientId: string;

  @IsString()
  doctorId: string;

  @Type(() => Date)
  @IsDate({ message: 'Date must be a valid date' })
  date: Date;
}
