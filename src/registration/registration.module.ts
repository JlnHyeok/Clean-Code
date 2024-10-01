import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { LectureService } from 'src/lecture/lecture.service';

@Module({
  imports: [],
  controllers: [RegistrationController],
  providers: [LectureService],
  exports: [],
})
export class RegistrationModule {}
