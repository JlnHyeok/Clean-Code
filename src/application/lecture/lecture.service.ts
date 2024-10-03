import { Inject, Injectable } from '@nestjs/common';
import {
  ILectureRepository,
  LECTURE_REPOSITORY,
} from '../../domain/repositories/lecture.repository';

@Injectable()
export class LectureService {
  constructor(
    @Inject(LECTURE_REPOSITORY)
    private readonly lectureRepository: ILectureRepository,
  ) {}

  async findAvailableLectures(date: Date) {
    return this.lectureRepository.findAvailableLectures(date);
  }

  async countRegistrations(lectureId: number) {
    return this.lectureRepository.countRegistrations(lectureId);
  }
}
