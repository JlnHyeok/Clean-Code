import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LectureModule } from './application/lecture/lecture.module';
import { PrismaService } from './infrastructure/prisma/prisma.service';

@Module({
  imports: [LectureModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
