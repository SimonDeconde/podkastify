import { AuthJwt } from '@server/auth/auth.types';
import { RoutePath } from '@shared/route-path';
import { replaceAll } from '@shared/utils';

export const getMagicLink = (jwt: AuthJwt, next?: string) => {
  return replaceAll(RoutePath.MAGIC_LINK, {
    '[token]': jwt.accessToken,
    '[next]': next ?? RoutePath.DASHBOARD,
  });
};
