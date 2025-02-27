import { z } from 'zod';

export const PodcastEntryCreateDto = z.object({
  importUrl: z.string(),
});
export type PodcastEntryCreateDtoType = z.infer<typeof PodcastEntryCreateDto>;

export const PodcastEntryUpdateDto = z.object({
  id: z.string().uuid(),
  name: z.string().uuid().optional(),
});
export type PodcastEntryUpdateDtoType = z.infer<typeof PodcastEntryUpdateDto>;

export const PodcastEntryRemoveDto = z.object({
  id: z.array(z.string().uuid()).or(z.string().uuid()),
});
export type PodcastEntryRemoveDtoType = z.infer<typeof PodcastEntryRemoveDto>;

export const PodcastEntryFindByIdDto = z.object({
  id: z.string().uuid(),
});
export type PodcastEntryFindByIdDtoType = z.infer<
  typeof PodcastEntryFindByIdDto
>;
