import { Injectable } from '@nestjs/common';
import { IStudentRepository } from 'src/domain/repositories/student.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaStudentRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createStudent(name: string): Promise<void> {
    await this.prisma.student.create({
      data: {
        name: name,
      },
    });
  }
}
