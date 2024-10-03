export class Lecture {
  constructor(
    public id: number,
    public title: string,
    public tutor: string,
    public createdAt: Date,
    public capacity: number,
    public currentStudents: number,
  ) {}
}
