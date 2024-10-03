import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 학생 정보가 없을 시 40개 생성
    for (let i = 0; i < 40; i++) {
      await request(app.getHttpServer())
        .post('/students/create')
        .send({ name: `학생${i + 1}` });
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('40명 동시 수강 신청', () => {
    it('should allow only 30 registrations', async () => {
      const results = [];

      // 40개 요청 동시에 보내기
      for (let i = 0; i < 40; i++) {
        await new Promise((resolve) => {
          setTimeout(async () => {
            const result = await request(app.getHttpServer())
              .post('/registrations')
              .send({ studentId: i + 1, lectureId: 1 });
            results.push(result);
            resolve(void 0);
          }, 200); // 200ms 간격
        });
      }

      // 등록된 학생 수를 확인
      const res = await request(app.getHttpServer()).get(
        '/lectures/1/registrations/count',
      );

      // 30명만 등록되어야 함
      expect(Number(res.text)).toEqual(30);
    });
  });

  describe('한 강의 5개 연속 신청', () => {
    it('should allow only 1 registration', async () => {
      const results = [];
      const studentId = 2;
      const lectureId = 2;
      // 5개 요청 동시에 보내기
      for (let i = 0; i < 5; i++) {
        await new Promise((resolve) => {
          setTimeout(async () => {
            const result = await request(app.getHttpServer())
              .post('/registrations')
              .send({ studentId, lectureId });
            results.push(result);
            resolve(void 0);
          }, 200); // 200ms 간격
        });
      }

      // 학생이 신청한 강의 수를 확인
      const res = await request(app.getHttpServer()).get(
        `/registrations/${studentId}`,
      );
      const filtered = res.body.filter(
        (registration) => registration.lecture.id == lectureId,
      );

      // 1명만 등록되어야 함
      expect(Number(filtered.length)).toEqual(1);
    });
  });
});
