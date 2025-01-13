import { AuthJwt } from '@server/auth/auth.types';
import { UserById } from '@shared/interfaces';

export interface UserLoginResponse {
  jwt: AuthJwt;
  user: UserById;
}

export enum RequestMagicLinkStatus {
  Success = 'success',
  Error = 'error',
}

export interface RequestMagicLinkResponse {
  status: RequestMagicLinkStatus;
}
