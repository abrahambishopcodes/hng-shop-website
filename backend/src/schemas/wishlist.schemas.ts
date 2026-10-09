import { z } from 'zod';

export const WishlistParamSchema = z.object({
  productId: z.string().uuid(),
});
