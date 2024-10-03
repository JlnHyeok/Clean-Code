import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { Lecture } from '@prisma/client';
import { LectureService } from '../../application/lecture/lecture.service';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@UseFilters(HttpExceptionFilter)
@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get(':date/available')
  async findAvailableLectures(@Param('date') date: string): Promise<Lecture[]> {
    return this.lectureService.findAvailableLectures(new Date(date));
  }

  @Get(':lectureId/registrations/count')
  async countRegistrations(
    @Param('lectureId') lectureId: number,
  ): Promise<number> {
    return this.lectureService.countRegistrations(lectureId);
  }
}
