'use client';

import { SparklesIcon } from '@heroicons/react/24/outline';
import { RoutePath } from '@shared/route-path';
import { ErrorMessage } from '@web/components/ErrorMessage';
import { LoadingSpinner } from '@web/components/LoadingSpinner';
import { useTrpc } from '@web/contexts/TrpcContext';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useUserContext } from '../user/UserContext';

export default function VerifyMagicLink() {
  const { trpc } = useTrpc();
  const { setAccessToken, setCurrentUser } = useUserContext();
  const [token] = useQueryParam('token', withDefault(StringParam, ''));
  const [next] = useQueryParam(
    'next',
    withDefault(StringParam, RoutePath.DASHBOARD),
  );

  const userJwt = trpc.userRouter.verifyAccessToken.useQuery({
    accessToken: token,
  });

  useEffect(() => {
    if (userJwt.data && setCurrentUser) {
      setAccessToken(userJwt.data.jwt.accessToken, userJwt.data.jwt.expiresIn);
      setCurrentUser(userJwt.data.user);

      window.location.href = next;
    }

    if (userJwt.error) {
      toast.error(userJwt.error.message);
    }
  }, [userJwt, setAccessToken, setCurrentUser, next]);

  if (!token) {
    return (
      <ErrorMessage message="Looks like a bad link... No token provided!" />
    );
  }

  return (
    <div className="text- flex min-h-full flex-1 flex-col justify-center px-6 py-12 text-center lg:px-8">
      <div className="mx-auto flex size-full max-w-[50rem] flex-col">
        <header className="z-50 mb-auto flex w-full justify-center py-4">
          <nav className="px-4 sm:px-6 lg:px-8" aria-label="Global">
            <div className="flex flex-none items-center gap-4 text-xl font-semibold sm:text-3xl">
              <SparklesIcon className="h-12 w-12" />
              Magic link...
            </div>
          </nav>
        </header>
        <div className="px-4 py-10 text-center sm:px-6 lg:px-8">
          <div className="mt-3 text-gray-600">
            {userJwt.error ? (
              <ErrorMessage message={userJwt.error.message} />
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
