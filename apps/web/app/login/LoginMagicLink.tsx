'use client';

import { Button, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RequestMagicLoginLinkDto,
  UserLoginDtoType,
} from '@server/user/user.dto';
import { RequestMagicLinkStatus } from '@server/user/user.types';
import { RoutePath } from '@shared/route-path';
import { FormErrorMessage } from '@web/components/FormErrorMessage';
import { useTrpc } from '@web/contexts/TrpcContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useUserContext } from '../user/UserContext';

export default function LoginMagicLink() {
  const router = useRouter();
  const { trpc } = useTrpc();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<UserLoginDtoType>({
    resolver: zodResolver(RequestMagicLoginLinkDto),
  });
  const requestMagicLoginLink =
    trpc.userRouter.requestMagicLoginLink.useMutation();
  const { currentUser } = useUserContext();

  useEffect(() => {
    if (currentUser) {
      window.location.href = RoutePath.DASHBOARD;
    }
  }, [currentUser, router]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            onSubmit={handleSubmit(async (data) => {
              try {
                const response = await requestMagicLoginLink.mutateAsync(data);
                if (response.status === RequestMagicLinkStatus.Success) {
                  toast.success('Magic link sent');
                  reset();
                } else {
                  toast.error('Something went wrong');
                }
              } catch (e) {
                toast.error('There was a problem');
              }
            })}
          >
            <Input
              type="email"
              label="Email"
              isRequired={true}
              color={Boolean(errors.email) ? 'danger' : undefined}
              isInvalid={Boolean(errors.email)}
              errorMessage={errors.email?.message}
              {...register('email', { required: true })}
            />

            <FormErrorMessage errors={errors} />

            <Button
              color="primary"
              type="submit"
              isLoading={requestMagicLoginLink.isLoading}
            >
              Send me a magic link
            </Button>
          </form>
          {requestMagicLoginLink.error && (
            <p className="mt-2 text-center text-sm text-red-600">
              {requestMagicLoginLink.error.message}
            </p>
          )}

          <p className="mt-10 text-center text-sm">
            <Link href={RoutePath.LOGIN_PASSWORD} className="">
              Use your password instead!
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
