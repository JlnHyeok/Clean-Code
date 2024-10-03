import { describe } from 'node:test';
import { RegistrationService } from './registration.service';
import {
  IRegistrationRepository,
  REGISTRATION_REPOSITORY,
} from '../../domain/repositories/registration.repository';
import {
  ILectureRepository,
  LECTURE_REPOSITORY,
} from '../../domain/repositories/lecture.repository';
import { Test } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let lectureRepository: ILectureRepository;
  let registrationRepository: IRegistrationRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        RegistrationService,
        {
          provide: LECTURE_REPOSITORY,
          useValue: {
            countRegistrations: jest.fn(),
          },
        },
        {
          provide: REGISTRATION_REPOSITORY,
          useValue: {
            addTask: jest.fn(),
            findRegistrationsByStudentId: jest.fn(),
            registerLecture: jest.fn(),
          },
        },
        {
          provide: getQueueToken('test'),
          useValue: {
            addTask: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RegistrationService>(RegistrationService);
    lectureRepository = module.get<ILectureRepository>(LECTURE_REPOSITORY);
    registrationRepository = module.get<IRegistrationRepository>(
      REGISTRATION_REPOSITORY,
    );
  });

  describe('registerLecture', () => {
    // 정상 케이스
    it('should register lecture', async () => {
      jest.spyOn(lectureRepository, 'countRegistrations').mockResolvedValue(0);

      const createRegistrationDto = {
        studentId: 1,
        lectureId: 1,
      };

      const res = await service.registerLecture(createRegistrationDto);
      expect(lectureRepository.countRegistrations).toHaveBeenCalledWith(
        createRegistrationDto.lectureId,
      );
      expect(registrationRepository.registerLecture).toHaveBeenCalledWith(
        createRegistrationDto,
      );
    });

    // 이미 해당 특강에 신청한 경우
    it('should throw ConflictException', async () => {
      jest.spyOn(lectureRepository, 'countRegistrations').mockResolvedValue(0);
      jest
        .spyOn(registrationRepository, 'findRegistrationsByStudentId')
        .mockResolvedValue([
          {
            studentId: 1,
            lecture: {
              id: 1,
              title: '수업1',
              tutor: '선생1',
              createdAt: new Date(),
              currentStudents: 1,
              capacity: 30,
            },
          },
        ]);

      const createRegistrationDto = {
        studentId: 1,
        lectureId: 1,
      };

      await expect(
        service.registerLecture(createRegistrationDto),
      ).rejects.toThrow(Error('이미 해당 특강에 신청하셨습니다.'));
    });

    // 해당 특강의 신청 인원이 30명을 넘은 경우
    it('should throw ConflictException', async () => {
      jest.spyOn(lectureRepository, 'countRegistrations').mockResolvedValue(30);

      const createRegistrationDto = {
        studentId: 1,
        lectureId: 1,
      };

      await expect(
        service.registerLecture(createRegistrationDto),
      ).rejects.toThrow(Error('해당 특강의 신청 인원이 마감되었습니다'));
    });
  });

  describe('findRegistrationsByStudentId', () => {
    it('should return registrations', async () => {
      const studentId = 1;

      await service.findRegistrationsByStudentId(studentId);
      expect(
        registrationRepository.findRegistrationsByStudentId,
      ).toHaveBeenCalledWith(studentId);
    });
  });
});
