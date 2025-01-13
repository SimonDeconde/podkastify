import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DmsService } from '@server/dms/dms.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly dmsService: DmsService) {}

  @Cron('0 * * * * *')
  async everyMinute() {
    this.logger.debug('Called every minute!');

    // const files = await this.dmsService.listFiles();

    // console.log(files);

    // const url = await this.dmsService.getFileUrl('item1/item1.mp3');

    // console.log(url);

    // const url2 = await this.dmsService.getPresignedSignedUrl('item2/item2.mp3');

    // console.log(url2);
  }

  @Cron('0 */5 * * * *')
  everyFiveMinute() {
    this.logger.debug('Called every 5 minutes!');

    // this.eventService.recycleInvitations();
  }

  @Cron('0 0 * * * *')
  everyHour() {
    this.logger.debug('Called every hour!');

    // this.eventService.recycleInvitations();
  }
}
