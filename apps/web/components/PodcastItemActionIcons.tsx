import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@heroui/react';
import { PodcastEntryDto } from '@server/podcast-entry/entities/podcast-entry.entity';
import { useTrpc } from '@web/contexts/TrpcContext';
import React from 'react';
import { toast } from 'sonner';

type Props = {
  podcastItem?: PodcastEntryDto;
  onUpdate?: () => void;
};

export const PodcastItemActionIcons = ({ podcastItem, onUpdate }: Props) => {
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

  const getActionIcons = () => {
    return [
      <Tooltip content="Remove" key="remove">
        <span
          className="cursor-pointer text-lg text-default-400 hover:text-red-500 active:opacity-50"
          onClick={() => podcastItem && removeCallback(podcastItem?.id)}
        >
          {removePodcastItem.isLoading ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
          ) : (
            <TrashIcon className="h-4 w-4" />
          )}
        </span>
      </Tooltip>,
    ];
  };

  buttons.push(getActionIcons());

  return (
    <div className="flex items-center gap-2">
      {buttons.map((button, index) => (
        <div key={index}>{button}</div>
      ))}
    </div>
  );
};
