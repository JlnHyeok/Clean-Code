export const STUDENT_REPOSITORY = 'STUDENT_REPOSITORY';

export interface IStudentRepository {
  createStudent(name: string): Promise<void>;
}
