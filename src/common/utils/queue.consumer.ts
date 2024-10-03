import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { RegistrationService } from '../../application/registration/registration.service';
import { CreateRegistrationDto } from '../../application/registration/dto/create-registration.dto';
import { UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../presentation/filters/http-exception.filter';

@UseFilters(HttpExceptionFilter)
@Processor('test')
export class QueueConsumer {
  constructor(private readonly registrationService: RegistrationService) {}

  @Process({ concurrency: 100, name: 'task' })
  async handleTask(job: Job<unknown>) {
    const createRegistrationDto = job.data as CreateRegistrationDto;
    try {
      // job.takeLock();
      await this.registrationService.registerLecture(createRegistrationDto);
    } catch (e) {
      await job.moveToFailed({ message: e.message }, true);
      throw e;
    }
  }
}
