import { Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { PrismaLectureRepository } from '../../infrastructure/prisma/prisma-lecture.repository';
import { LectureController } from '../..//presentation/controllers/lecture.controller';
import { REGISTRATION_REPOSITORY } from '../..//domain/repositories/registration.repository';
import { PrismaLectureRegistrationRepository } from '../..//infrastructure/prisma/prisma-registration.repository';
import { RegistrationController } from '../..//presentation/controllers/registration.controller';
import { RegistrationService } from '../registration/registration.service';
import { LECTURE_REPOSITORY } from '../..//domain/repositories/lecture.repository';
import { StudentController } from '../../presentation/controllers/student.controller';
import { STUDENT_REPOSITORY } from '../../domain/repositories/student.repository';
import { PrismaStudentRepository } from '../../infrastructure/prisma/prisma-student.repository';
import { StudentService } from '../student/student.service';
import { BullModule } from '@nestjs/bull';
import { QueueConsumer } from '../../common/utils/queue.consumer';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),

    BullModule.registerQueue({
      name: 'test',
    }),
  ],
  controllers: [LectureController, RegistrationController, StudentController],
  providers: [
    LectureService,
    RegistrationService,
    StudentService,
    PrismaService,
    QueueConsumer,
    {
      provide: LECTURE_REPOSITORY,
      useClass: PrismaLectureRepository,
    },
    {
      provide: REGISTRATION_REPOSITORY,
      useClass: PrismaLectureRegistrationRepository,
    },
    {
      provide: STUDENT_REPOSITORY,
      useClass: PrismaStudentRepository,
    },
  ],
})
export class LectureModule {}
