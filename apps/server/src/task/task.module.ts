import { Module } from '@nestjs/common';
import { UploadsModule } from '@server/dms/dms.module';
import { PodcastEntryModule } from '@server/podcast-entry/podcast-entry.module';
import { PodcastEntryService } from '@server/podcast-entry/podcast-entry.service';
import { PrismaModule } from '@server/prisma/prisma.module';
import { TaskService } from './task.service';

@Module({
  imports: [PodcastEntryModule, PrismaModule, UploadsModule],
  providers: [TaskService, PodcastEntryService],
})
export class TaskModule {}
