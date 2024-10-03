import {
  ILectureRepository,
  LECTURE_REPOSITORY,
} from '../../domain/repositories/lecture.repository';
import {
  IRegistrationRepository,
  REGISTRATION_REPOSITORY,
} from '../../domain/repositories/registration.repository';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Registration } from '../../domain/entities/registration.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class RegistrationService {
  constructor(
    @Inject(LECTURE_REPOSITORY)
    private readonly lectureRepository: ILectureRepository,
    @Inject(REGISTRATION_REPOSITORY)
    private readonly registrationRepository: IRegistrationRepository,
    @InjectQueue('test') private readonly queue: Queue,
  ) {}

  async addTask(task: any) {
    await this.queue.add('task', task, {
      removeOnComplete: true,
      removeOnFail: true,
      attempts: 5,
      backoff: 3000,
    });
  }

  async registerLecture(
    createRegistrationDto: CreateRegistrationDto,
  ): Promise<void> {
    const { studentId, lectureId } = createRegistrationDto;

    // 이미 해당 특강에 신청한 경우
    const existingRegistrations =
      await this.registrationRepository.findRegistrationsByStudentId(studentId);

    const isRegister: boolean = existingRegistrations?.some(
      (info) => info.lecture.id == lectureId,
    );

    if (isRegister) {
      throw new ConflictException('이미 해당 특강에 신청하셨습니다.');
    }

    // 해당 특강의 신청 인원이 30명을 넘은 경우
    const registerationCount =
      await this.lectureRepository.countRegistrations(lectureId);

    if (registerationCount >= 30) {
      throw new ConflictException('해당 특강의 신청 인원이 마감되었습니다');
    }

    return await this.registrationRepository.registerLecture(
      createRegistrationDto,
    );
  }

  async findRegistrationsByStudentId(
    studentId: number,
  ): Promise<Registration[]> {
    return this.registrationRepository.findRegistrationsByStudentId(studentId);
  }
}
