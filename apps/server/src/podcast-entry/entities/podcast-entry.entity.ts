import { PodcastEntry, PodcastEntryStatus } from '@prisma/client';

export type PodcastEntryDto = {
  id: string;
  status: PodcastEntryStatus;
  createdAt: Date;
  updatedAt: Date;
  importUrl: string;
  processingTimeMs?: number;
  author?: string;
  title?: string;
  description?: string;
  language?: string;
  pubDate?: Date;
  image?: string;
  durationMs?: number;
  b2ImagePath?: string;
};

export const podcastEntryToDto = (podcastEntry: PodcastEntry) => {
  return {
    id: podcastEntry.id,
    status: podcastEntry.status,
    createdAt: podcastEntry.createdAt,
    updatedAt: podcastEntry.updatedAt,
    importUrl: podcastEntry.importUrl,
    processingTimeMs: podcastEntry.processingTimeMs,
    author: podcastEntry.author,
    title: podcastEntry.title,
    description: podcastEntry.description,
    language: podcastEntry.language,
    pubDate: podcastEntry.pubDate,
    durationMs: podcastEntry.durationMs,
    b2ImagePath: podcastEntry.b2ImagePath,
  } as PodcastEntryDto;
};
