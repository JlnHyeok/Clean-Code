import { Lecture } from '@prisma/client';

export const LECTURE_REPOSITORY = 'LECTURE_REPOSITORY';

export interface ILectureRepository {
  findAvailableLectures(createdAt: Date): Promise<Lecture[]>;
  countRegistrations(lectureId: number): Promise<number>;
}
