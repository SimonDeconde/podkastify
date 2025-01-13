import { Injectable, UseFilters } from '@nestjs/common';
import { PodcastEntryService } from '@server/podcast-entry/podcast-entry.service';
import { TrpcExceptionFilter } from '@server/trpc/trpc.exception-handler';
import { TrpcService } from '@server/trpc/trpc.service';
import { Roles } from '@shared/interfaces';
import { podcastEntryToDto } from './entities/podcast-entry.entity';
import {
  PodcastEntryCreateDto,
  PodcastEntryFindByIdDto,
  PodcastEntryRemoveDto,
  PodcastEntryUpdateDto,
} from './podcast-entry.dto';

@Injectable()
@UseFilters(new TrpcExceptionFilter())
export class PodcastEntryRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly podcastEntryService: PodcastEntryService,
  ) {}
  apply() {
    return {
      podcastEntryRouter: this.trpcService.trpc.router({
        // creates a podcastEntry from dashboard
        create: this.trpcService
          .protectedProcedure()
          .input(PodcastEntryCreateDto)
          .mutation(async ({ input, ctx }) => {
            return this.podcastEntryService.createFromUrl(
              input.importUrl,
              ctx.user,
            );
          }),

        // update podcastEntry
        update: this.trpcService
          .protectedProcedure()
          .input(PodcastEntryUpdateDto)
          .mutation(async ({ input, ctx }) => {
            if (ctx.user) {
              return this.podcastEntryService.update(input, ctx.user);
            }
          }),

        // remove podcastEntry
        remove: this.trpcService
          .protectedProcedure([Roles.Admin])
          .input(PodcastEntryRemoveDto)
          .mutation(async ({ input, ctx }) => {
            if (ctx.user) {
              return this.podcastEntryService.remove(input.id, ctx.user);
            }
          }),

        // get podcastEntry by id
        findById: this.trpcService
          .publicProcedure()
          .input(PodcastEntryFindByIdDto)
          .query(async ({ input }) => {
            return podcastEntryToDto(
              await this.podcastEntryService.findById(input.id),
            );
          }),

        findMyPodcastEntries: this.trpcService
          .protectedProcedure([Roles.Admin, Roles.User])
          .query(async ({ ctx }) => {
            const items = await this.podcastEntryService.findUserPodcastEntries(
              ctx.user,
            );
            return { records: items.map(podcastEntryToDto) };
          }),
      }),
    };
  }
}
