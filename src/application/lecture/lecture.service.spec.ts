import { describe } from 'node:test';
import { LectureService } from './lecture.service';
import {
  ILectureRepository,
  LECTURE_REPOSITORY,
} from '../../domain/repositories/lecture.repository';
import { Test, TestingModule } from '@nestjs/testing';

describe('LectureService', () => {
  let service: LectureService;
  let lectureRepository: ILectureRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LectureService,
        {
          provide: LECTURE_REPOSITORY,
          useValue: {
            findAvailableLectures: jest.fn(),
            countRegistrations: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LectureService>(LectureService);
    lectureRepository = module.get<ILectureRepository>(LECTURE_REPOSITORY);

    jest.spyOn(lectureRepository, 'findAvailableLectures').mockResolvedValue([
      {
        id: 1,
        title: '수업1',
        tutor: '선생1',
        createdAt: new Date(),
        currentStudents: 0,
        capacity: 30,
      },
    ]);

    jest.spyOn(lectureRepository, 'countRegistrations').mockResolvedValue(0);
  });

  describe('findAvailableLectures', () => {
    it('should return available lectures', async () => {
      const date = new Date();
      const res = await service.findAvailableLectures(date);
      expect(lectureRepository.findAvailableLectures).toHaveBeenCalledWith(
        date,
      );

      expect(res).toEqual([
        {
          id: 1,
          title: '수업1',
          tutor: '선생1',
          createdAt: expect.any(Date),
          currentStudents: 0,
          capacity: 30,
        },
      ]);
    });
  });

  describe('countRegistrations', () => {
    it('should return registration count', async () => {
      const lectureId = 1;
      const res = await service.countRegistrations(lectureId);
      expect(lectureRepository.countRegistrations).toHaveBeenCalledWith(
        lectureId,
      );
      expect(res).toBe(0);
    });
  });
});
