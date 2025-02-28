'use client';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button, Input, Link } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserLoginDto, UserLoginDtoType } from '@server/user/user.dto';
import { RoutePath } from '@shared/route-path';
import { useTrpc } from '@web/contexts/TrpcContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useUserContext } from '../../user/UserContext';

export default function Login() {
  const router = useRouter();
  const { trpc } = useTrpc();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserLoginDtoType>({
    resolver: zodResolver(UserLoginDto),
  });
  const loginUser = trpc.userRouter.login.useMutation();
  const { currentUser, setCurrentUser, setAccessToken } = useUserContext();

  useEffect(() => {
    if (currentUser) {
      window.location.href = RoutePath.DASHBOARD;
    }
  }, [currentUser, router]);

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
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
              const userJwt = await loginUser.mutateAsync(data);
              if (userJwt.user && setCurrentUser) {
                setAccessToken(userJwt.jwt.accessToken, userJwt.jwt.expiresIn);
                setCurrentUser(userJwt.user);
              }
            } catch (e) {
              toast.error('There was a problem during login');
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

          <Input
            label="Password"
            isRequired={true}
            color={Boolean(errors.password) ? 'danger' : undefined}
            isInvalid={Boolean(errors.password)}
            errorMessage={errors.password?.message}
            {...register('password', { required: true })}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeIcon className="pointer-events-none h-4 w-4" />
                ) : (
                  <EyeSlashIcon className="pointer-events-none h-4 w-4" />
                )}
              </button>
            }
            type={isVisible ? 'text' : 'password'}
          />

          <Button color="primary" type="submit" isLoading={loginUser.isLoading}>
            Sign in
          </Button>
        </form>
        {loginUser.error && (
          <p className="mt-2 text-center text-sm text-red-600">
            {loginUser.error.message}
          </p>
        )}
        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member? <Link href={RoutePath.SIGNUP}>Sign up!</Link>
        </p>

        <p className="mt-10 text-center text-sm text-gray-500">
          <Link href={RoutePath.FORGOT_PASSWORD}>Forgot password?</Link>
        </p>

        <p className="mt-10 text-center text-sm text-gray-500">
          <Link href={RoutePath.LOGIN}>Use a magic link to sign in!</Link>
        </p>
      </div>
    </div>
  );
}
