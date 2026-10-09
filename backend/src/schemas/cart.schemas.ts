import { z } from 'zod';

export const AddToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
});

export const CartItemParamSchema = z.object({
  itemId: z.string().uuid(),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1),
});
