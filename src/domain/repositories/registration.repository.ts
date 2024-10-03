import { Registration } from '../entities/registration.entity';
import { CreateRegistrationDto } from 'src/application/registration/dto/create-registration.dto';

export const REGISTRATION_REPOSITORY = 'REGISTRATION_REPOSITORY';

export interface IRegistrationRepository {
  registerLecture(createRegistrationDto: CreateRegistrationDto): Promise<void>;
  findRegistrationsByStudentId(studentId: number): Promise<Registration[]>;
}
