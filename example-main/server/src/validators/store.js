import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  ownerId: z.string().uuid(),
});

export const queryStoresSchema = z.object({
  search: z.string().max(200).optional(),
});
