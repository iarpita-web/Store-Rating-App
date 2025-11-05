import { z } from 'zod';

export const upsertRatingSchema = z.object({
  storeId: z.string().uuid(),
  stars: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});
