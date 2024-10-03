import { Post, Body, Controller, UseFilters } from '@nestjs/common';
import { StudentService } from '../../application/student/student.service';
import { CreateStudentDto } from '../../application/student/dto/create-student.dto';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@UseFilters(HttpExceptionFilter)
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('create')
  async createStudent(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<void> {
    await this.studentService.createStudent(createStudentDto.name);
  }
}
