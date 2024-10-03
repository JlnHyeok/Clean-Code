import { Lecture } from '@prisma/client';

export class Registration {
  constructor(
    public studentId: number,
    public lecture: Lecture,
  ) {}
}
