import { PodcastEntry } from '@prisma/client';

export const getUserFeedPath = (userId: string) => {
  return `${getUserFolderObjectPath(userId)}/feed.xml`;
};

export const getPodcastEntryAudioObjectPath = (podcastEntry: PodcastEntry) => {
  return `${getUserFolderObjectPath(podcastEntry.userId)}/entries/${podcastEntry.id}.mp3`;
};

export const getPodcastEntryImageObjectPath = (podcastEntry: PodcastEntry) => {
  return `${getUserFolderObjectPath(podcastEntry.userId)}/entries/${podcastEntry.id}.jpg`;
};

export const getUserFolderObjectPath = (userId: string) => {
  return `users/${userId}`;
};
