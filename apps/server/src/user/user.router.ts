import { Injectable, UseFilters } from '@nestjs/common';
import { TrpcExceptionFilter } from '@server/trpc/trpc.exception-handler';
import { TrpcService } from '@server/trpc/trpc.service';
import { UserService } from '@server/user/user.service';
import {
  ApiOperationOutcome,
  ApiOperationStatus,
  Roles,
} from '@shared/interfaces';
import { userToDto } from './entities/user.entity';
import {
  QuickLoginDto,
  RequestMagicLoginLinkDto,
  UserCreateDto,
  UserFindAllDto,
  UserFindByIdDto,
  UserLoginDto,
  UserRemoveDto,
  UserResetPasswordDto,
  UserSignupDto,
  UserUpdateDto,
  UserVerifyAccessTokenDto,
} from './user.dto';

@Injectable()
@UseFilters(new TrpcExceptionFilter())
export class UserRouter {
  constructor(
    private readonly trpcService: TrpcService,
    private readonly userService: UserService,
  ) {}

  apply() {
    return {
      userRouter: this.trpcService.trpc.router({
        // login user
        login: this.trpcService
          .publicProcedure()
          .input(UserLoginDto)
          .mutation(async ({ input }) => {
            return this.userService.login(input);
          }),

        // Magic login link.
        requestMagicLoginLink: this.trpcService
          .publicProcedure()
          .input(RequestMagicLoginLinkDto)
          .mutation(async ({ input }) => {
            return this.userService.requestMagicLoginLink(input);
          }),

        // Quick login, for debugging.
        quickLogin: this.trpcService
          .protectedProcedure()
          .input(QuickLoginDto)
          .mutation(async ({ input }) => {
            return this.userService.quickLogin(input);
          }),

        // signs up a user
        signup: this.trpcService
          .publicProcedure()
          .input(UserSignupDto)
          .mutation(async ({ input }) => {
            return this.userService.signup(input);
          }),

        // creates a user from dashboard
        create: this.trpcService
          .protectedProcedure([Roles.Admin])
          .input(UserCreateDto)
          .mutation(async ({ input }) => {
            return this.userService.create(input);
          }),

        // update user
        update: this.trpcService
          .protectedProcedure()
          .input(UserUpdateDto)
          .mutation(async ({ input }) => {
            return this.userService.update(input);
          }),

        // remove user
        remove: this.trpcService
          .protectedProcedure([Roles.Admin])
          .input(UserRemoveDto)
          .mutation(async ({ input, ctx }) => {
            return this.userService.remove(input.id, ctx.user);
          }),

        // get user by id
        findById: this.trpcService
          .protectedProcedure()
          .input(UserFindByIdDto)
          .query(async ({ input }) => {
            const user = await this.userService.findById(input.id);
            return user ? userToDto(user) : null;
          }),

        // get all users
        findAll: this.trpcService
          .protectedProcedure([Roles.Admin, Roles.User])
          .input(UserFindAllDto)
          .query(async ({ input }) => {
            const users = await this.userService.findAll(input);
            return { ...users, records: users.records.map(userToDto) };
          }),

        // get user by id
        verifyAccessToken: this.trpcService
          .publicProcedure()
          .input(UserVerifyAccessTokenDto)
          .query(async ({ input }) => {
            try {
              return this.userService.verifyAccessToken(input.accessToken);
            } catch (e) {
              console.error('Error verifying access token:', e);
            }
          }),

        // reset user password
        resetPassword: this.trpcService
          .publicProcedure()
          .input(UserResetPasswordDto)
          .mutation(async ({ input }): Promise<ApiOperationStatus> => {
            // The response of this method is irrelevant, as we don't want to reveal if
            // the email exists or not.
            await this.userService.resetPassword({
              email: input.email,
            });

            return {
              status: ApiOperationOutcome.Success,
            };
          }),
      }),
    };
  }
}
