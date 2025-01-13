'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import {
  PodcastEntryCreateDto,
  PodcastEntryCreateDtoType,
} from '@server/podcast-entry/podcast-entry.dto';
import { useTrpc } from '@web/contexts/TrpcContext';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type Props = {};

export default function AddPodcastItem({}: Props) {
  const { trpc } = useTrpc();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<PodcastEntryCreateDtoType>({
    resolver: zodResolver(PodcastEntryCreateDto),
    defaultValues: {
      importUrl: '',
    },
  });
  const createPodcastEntry = trpc.podcastEntryRouter.create.useMutation();

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            Add new entry
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            onSubmit={handleSubmit(async (data) => {
              try {
                const response = await createPodcastEntry.mutateAsync(data);
                console.log(response);

                toast.success('Podcast entry added successfully');
                reset();
              } catch (e) {
                toast.error(
                  'A problem occurred while trying to import this URL',
                );
              }
            })}
          >
            <div className="space-between flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  label="Url"
                  isRequired={true}
                  color={Boolean(errors.importUrl) ? 'danger' : undefined}
                  isInvalid={Boolean(errors.importUrl)}
                  errorMessage={errors.importUrl?.message}
                  {...register('importUrl', { required: true })}
                />
              </div>
            </div>
            <Button
              color="primary"
              type="submit"
              isLoading={createPodcastEntry.isLoading}
            >
              Import
            </Button>
          </form>
          {createPodcastEntry.error && (
            <p className="mt-2 text-center text-sm text-red-600">
              {createPodcastEntry.error.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
