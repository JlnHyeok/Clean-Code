import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { CreateRegistrationDto } from '../../application/registration/dto/create-registration.dto';
import { RegistrationService } from '../../application/registration/registration.service';
import { Registration } from '../../domain/entities/registration.entity';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@UseFilters(HttpExceptionFilter)
@Controller('registrations')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  async registerLecture(@Body() registerLectureDto: CreateRegistrationDto) {
    await this.registrationService.addTask(registerLectureDto);
  }

  @Get(':studentId')
  async findRegistrationsByStudentId(
    @Param('studentId') studentId: number,
  ): Promise<Registration[]> {
    return this.registrationService.findRegistrationsByStudentId(studentId);
  }
}
