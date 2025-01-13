import { Global, Module } from '@nestjs/common';
import { PodcastEntryModule } from '@server/podcast-entry/podcast-entry.module';
import { RoleModule } from '@server/role/role.module';
import { UserModule } from '@server/user/user.module';
import { TrpcRouter } from './trpc.router';
import { TrpcService } from './trpc.service';

@Global()
@Module({
  imports: [UserModule, RoleModule, PodcastEntryModule],
  controllers: [],
  providers: [TrpcService, TrpcRouter],
  exports: [TrpcService],
})
export class TrpcModule {}
