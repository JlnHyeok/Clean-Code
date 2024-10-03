import { IsNumber, IsString } from 'class-validator';

export class CreateRegistrationDto {
  @IsNumber()
  lectureId: number;

  @IsNumber()
  studentId: number;
}
