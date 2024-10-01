import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { LectureModule } from './lecture/lecture.module';
import { RegistrationController } from './registration/registration.controller';
import { RegistrationService } from './registration/registration.service';
import { RegistrationModule } from './registration/registration.module';

@Module({
  imports: [LectureModule, RegistrationModule],
  controllers: [AppController, RegistrationController],
  providers: [AppService, PrismaService, RegistrationService],
  exports: [PrismaService], // PrismaService 를 다른 모듈에서 사용할 수 있도록 내보내기
})
export class AppModule {}
