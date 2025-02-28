'use client';

import { Button } from '@heroui/react';
import { useTrpc } from '@web/contexts/TrpcContext';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

type Props = {};

export default function GetPodcastFeedUrlButton({}: Props) {
  const { trpc } = useTrpc();
  const feedUrl = trpc.podcastEntryRouter.getPodcastFeedUrl.useQuery();
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = useCallback(() => {
    if (feedUrl.data) {
      navigator.clipboard.writeText(feedUrl.data);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      toast.error('Failed to get feed URL');
    }
  }, [feedUrl]);

  return (
    <Button color="secondary" onClick={handleClick}>
      {isCopied ? 'Copied!' : 'Copy feed URL'}
    </Button>
  );
}
