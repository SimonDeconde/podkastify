import { Module } from '@nestjs/common';
import { UploadsModule } from '@server/dms/dms.module';
import { PrismaModule } from '@server/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PodcastEntryRouter } from './podcast-entry.router';
import { PodcastEntryService } from './podcast-entry.service';

@Module({
  imports: [AuthModule, PrismaModule, UploadsModule],
  providers: [PodcastEntryService, PodcastEntryRouter],
  exports: [PodcastEntryService, PodcastEntryRouter],
})
export class PodcastEntryModule {}
