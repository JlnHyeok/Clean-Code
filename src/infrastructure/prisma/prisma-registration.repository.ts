import { IRegistrationRepository } from 'src/domain/repositories/registration.repository';
import { PrismaService } from './prisma.service';
import { Registration } from 'src/domain/entities/registration.entity';
import { CreateRegistrationDto } from '../../application/registration/dto/create-registration.dto';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class PrismaLectureRegistrationRepository
  implements IRegistrationRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async registerLecture(createRegistrationDto: CreateRegistrationDto) {
    const { studentId, lectureId } = createRegistrationDto;

    for (let i = 0; i < 5; i++) {
      try {
        await this.prisma.$transaction(async (prisma) => {
          const lecture = await prisma.lecture.findUnique({
            where: {
              id: lectureId,
            },
          });

          if (lecture.currentStudents >= 30)
            throw new ConflictException(
              '해당 특강의 신청 인원이 마감되었습니다',
            );

          await prisma.lectureRegistration.create({
            data: {
              lectureId,
              studentId,
            },
          });

          // 해당 특강의 신청 인원을 1 증가시킨다.
          await prisma.lecture.update({
            where: {
              id: lectureId,
            },
            data: {
              currentStudents: {
                increment: 1,
              },
            },
          });
        });

        break;
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, 100 * 2 ** i));
      }
    }
  }

  async findRegistrationsByStudentId(
    studentId: number,
  ): Promise<Registration[]> {
    return await this.prisma.lectureRegistration.findMany({
      where: {
        studentId: Number(studentId),
      },
      select: {
        lectureId: false,
        studentId: true,
        lecture: true,
      },
    });
  }
}
