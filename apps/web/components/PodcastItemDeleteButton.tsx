import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/button';
import { PodcastEntryDto } from '@server/podcast-entry/entities/podcast-entry.entity';
import { useTrpc } from '@web/contexts/TrpcContext';
import React from 'react';
import { toast } from 'sonner';

type Props = {
  podcastItem?: PodcastEntryDto;
  onUpdate?: () => void;
};

export const PodcastItemDeleteButton = ({ podcastItem, onUpdate }: Props) => {
  const { trpc } = useTrpc();

  const removePodcastItem = trpc.podcastEntryRouter.remove.useMutation();

  const removeCallback = async (podcastItemId: string) => {
    await removePodcastItem.mutateAsync({
      id: podcastItemId,
    });

    toast.success('Item deleted!');

    if (onUpdate) {
      onUpdate();
    }
  };

  const buttons: React.ReactNode[] = [];

  const getActionButtons = () => {
    return [
      <Button
        key="remove"
        className="toggle-full-view flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-red-500"
        onClick={() => podcastItem && removeCallback(podcastItem?.id)}
        disabled={removePodcastItem.isLoading}
      >
        {removePodcastItem.isLoading ? (
          <ArrowPathIcon className="h-4 w-4 animate-spin" />
        ) : (
          <TrashIcon className="h-4 w-4" />
        )}
      </Button>,
    ];
  };

  buttons.push(getActionButtons());

  return (
    <div className="flex gap-2">
      {buttons.map((button, index) => (
        <div key={index}>{button}</div>
      ))}
    </div>
  );
};
