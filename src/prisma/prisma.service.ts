import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// NestJS LifeCycle 인 OnModuleInit, OnModuleDestroy 를 상속받아 Prisma 클라이언트와 연결 및 해제
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect(); // Prisma 클라이언트와 연결
  }

  async onModuleDestroy() {
    await this.$disconnect(); // 모듈이 종료될 때 Prisma 연결 해제
  }
}
