'use client';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { UserSignupDto, UserSignupDtoType } from '@server/user/user.dto';
import { RoutePath } from '@shared/route-path';
import { useTrpc } from '@web/contexts/TrpcContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUserContext } from '../user/UserContext';

type Props = {};

export default function Signup({}: Props) {
  const router = useRouter();
  const { trpc } = useTrpc();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const { currentUser, setAccessToken } = useUserContext();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserSignupDtoType>({
    resolver: zodResolver(UserSignupDto),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });
  const userSignup = trpc.userRouter.signup.useMutation();
  useEffect(() => {
    if (userSignup?.data?.user) {
      router.push(RoutePath.VERIFY_EMAIL);
    }
  }, [userSignup, router]);
  useEffect(() => {
    if (currentUser) {
      router.push(RoutePath.DASHBOARD);
    }
  }, [currentUser, router]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            Sign up for Podkastify
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            onSubmit={handleSubmit(async (data) => {
              const { jwt } = await userSignup.mutateAsync(data);
              if (jwt) {
                setAccessToken(jwt.accessToken, jwt.expiresIn);
              }
            })}
          >
            <div className="space-between flex gap-4">
              <div className="flex-1">
                <Input
                  type="firstName"
                  label="First name"
                  isRequired={true}
                  color={Boolean(errors.firstName) ? 'danger' : undefined}
                  isInvalid={Boolean(errors.firstName)}
                  errorMessage={errors.firstName?.message}
                  {...register('firstName', { required: true })}
                />
              </div>

              <div className="flex-1">
                <Input
                  type="lastName"
                  label="Last name"
                  isRequired={true}
                  color={Boolean(errors.lastName) ? 'danger' : undefined}
                  isInvalid={Boolean(errors.lastName)}
                  errorMessage={errors.lastName?.message}
                  {...register('lastName', { required: true })}
                />
              </div>
            </div>

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

            <Button
              color="primary"
              type="submit"
              isLoading={userSignup.isLoading}
            >
              Sign up
            </Button>
          </form>
          {userSignup.error && (
            <p className="mt-2 text-center text-sm text-red-600">
              {userSignup.error.message}
            </p>
          )}
          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{' '}
            <Link
              href={RoutePath.LOGIN}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
