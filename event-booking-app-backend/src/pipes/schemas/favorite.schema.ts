import { z } from 'zod';

export const createFavoriteSchema = z
  .object({
    currentUserId: z.number(),
    event_id: z.number(),
  })
  .required();

export type CreateFavoriteDto = z.infer<typeof createFavoriteSchema>;
