import { PodcastEntry, PodcastEntryStatus } from '@prisma/client';

export type PodcastEntryDto = {
  id: string;
  status: PodcastEntryStatus;
  createdAt: Date;
  updatedAt: Date;
  importUrl: string;
  url?: string;
  author?: string;
  owner?: string;
  title?: string;
  description?: string;
  language?: string;
  pubDate?: Date;
  image?: string;
  durationMs?: number;
  b2Path?: string;
};

export const podcastEntryToDto = (podcastEntry: PodcastEntry) => {
  return {
    id: podcastEntry.id,
    status: podcastEntry.status,
    createdAt: podcastEntry.createdAt,
    updatedAt: podcastEntry.updatedAt,
    importUrl: podcastEntry.importUrl,
    url: podcastEntry.url,
    author: podcastEntry.author,
    owner: podcastEntry.owner,
    title: podcastEntry.title,
    description: podcastEntry.description,
    language: podcastEntry.language,
    pubDate: podcastEntry.pubDate,
    image: podcastEntry.image,
    durationMs: podcastEntry.durationMs,
    b2Path: podcastEntry.b2Path,
  } as PodcastEntryDto;
};
