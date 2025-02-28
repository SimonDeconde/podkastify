'use client';

import { Button, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserLoginDtoType, UserResetPasswordDto } from '@server/user/user.dto';
import { useTrpc } from '@web/contexts/TrpcContext';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const router = useRouter();
  const { trpc } = useTrpc();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<UserLoginDtoType>({
    resolver: zodResolver(UserResetPasswordDto),
  });
  const resetPassword = trpc.userRouter.resetPassword.useMutation();

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Reset your password
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          onSubmit={handleSubmit(async (data) => {
            try {
              const response = await resetPassword.mutate(data);
              toast.success('Email sent!');
              reset();
            } catch (e) {
              toast.error('There was a problem during resetting password');
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

          <Button
            color="primary"
            type="submit"
            isLoading={resetPassword.isLoading}
          >
            Reset password
          </Button>
        </form>
        {resetPassword.error && (
          <p className="mt-2 text-center text-sm text-red-600">
            {resetPassword.error.message}
          </p>
        )}
      </div>
    </div>
  );
}
