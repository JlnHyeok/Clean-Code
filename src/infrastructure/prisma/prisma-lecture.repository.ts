import { ILectureRepository } from 'src/domain/repositories/lecture.repository';
import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';
import { Lecture } from 'src/domain/entities/lecture.entity';

@Injectable()
export class PrismaLectureRepository implements ILectureRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAvailableLectures(createdAt: Date) {
    const startDate = new Date(createdAt.setHours(0, 0, 0, 0));
    const endDate = new Date(createdAt.setHours(23, 59, 59, 999));

    const res = await this.prisma.lecture.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return res.filter((lecture) => lecture.currentStudents < 30);
  }

  async countRegistrations(lectureId: number) {
    let res: Lecture;
    await this.prisma.$transaction(async (prisma) => {
      res = await prisma.lecture.findUnique({
        where: {
          id: Number(lectureId),
        },
      });
    });
    return res.currentStudents;
  }
}
