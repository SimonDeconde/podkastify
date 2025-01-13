import { INestApplication, Injectable } from '@nestjs/common';
import { PodcastEntryRouter } from '@server/podcast-entry/podcast-entry.router';
import { RoleRouter } from '@server/role/role.router';
import { TrpcService, createContext } from '@server/trpc/trpc.service';
import { UserRouter } from '@server/user/user.router';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly userRouter: UserRouter,
    private readonly roleRouter: RoleRouter,
    private readonly podcastEntryRouter: PodcastEntryRouter,
  ) {}

  appRouter = this.trpcService.trpc.router({
    ...this.userRouter.apply(),
    ...this.roleRouter.apply(),
    ...this.podcastEntryRouter.apply(),
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext,
      }),
    );
  }
}

export type AppRouter = TrpcRouter[`appRouter`];

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
