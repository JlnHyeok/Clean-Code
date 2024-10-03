import { Inject, Injectable } from '@nestjs/common';
import {
  STUDENT_REPOSITORY,
  IStudentRepository,
} from '../../domain/repositories/student.repository';

@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
  ) {}

  async createStudent(name: string): Promise<void> {
    return this.studentRepository.createStudent(name);
  }
}
