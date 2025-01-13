'use client';

import { Spinner } from '@nextui-org/spinner';
import { RoutePath } from '@shared/route-path';
import { useTrpc } from '@web/contexts/TrpcContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useUserContext } from '../user/UserContext';

export default function VerifyEmail() {
  const { trpc } = useTrpc();
  const router = useRouter();
  const { setAccessToken, currentUser } = useUserContext();
  const [token] = useQueryParam('token', withDefault(StringParam, ''));

  const userJwt = trpc.userRouter.verifyAccessToken.useQuery({
    accessToken: token,
  });

  useEffect(() => {
    if (userJwt.data) {
      setAccessToken(token, userJwt.data.jwt.expiresIn);
    }
  }, [userJwt, setAccessToken, token]);

  useEffect(() => {
    if (currentUser) {
      router.push(RoutePath.HOME);
    }
  }, [currentUser, router]);

  return (
    <div className="text- flex min-h-full flex-1 flex-col justify-center px-6 py-12 text-center lg:px-8">
      <div className="mx-auto flex size-full max-w-[50rem] flex-col">
        <header className="z-50 mb-auto flex w-full justify-center py-4">
          <nav className="px-4 sm:px-6 lg:px-8" aria-label="Global">
            <div className="flex-none text-xl font-semibold dark:text-white sm:text-3xl">
              Email Verification
            </div>
          </nav>
        </header>
        <div className="px-4 py-10 text-center sm:px-6 lg:px-8">
          <div className="mt-3 text-gray-600 dark:text-gray-400">
            {token ? (
              <Spinner label="Verifying..." color="primary" />
            ) : (
              "Please check your email, we've sent you a link to verify your account"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
