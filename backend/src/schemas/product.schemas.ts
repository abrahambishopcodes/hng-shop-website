import { z } from 'zod';

export const AddProductSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1),
  price: z.number().positive(),
  discount: z.number().min(0).max(100).optional(),
  productImageKey: z.string().optional(),
  noInStock: z.number().int().min(0),
  freeDelivery: z.boolean().default(false),
  categories: z.array(z.string().trim().min(1)).min(1),
});
