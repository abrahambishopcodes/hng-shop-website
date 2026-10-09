import type { Request, Response } from 'express';
import type { z } from 'zod';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { prisma } from '../lib/db.js';
import type { AddProductSchema } from '../schemas/product.schemas.js';

export async function addProduct(request: Request, response: Response): Promise<void> {
  const { title, description, price, discount, productImageKey, noInStock, freeDelivery, categories } =
    request.body as z.infer<typeof AddProductSchema>;
  const { userId } = (request as AuthenticatedRequest).auth!;

  try {
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        ...(discount !== undefined && { discount }),
        productImageKey,
        noInStock,
        freeDelivery,
        sellerId: userId,
        categories: {
          connectOrCreate: categories.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        categories: { select: { id: true, name: true } },
        seller: { select: { id: true, fullName: true, email: true } },
      },
    });

    response.status(201).json({ product });
  } catch (error) {
    console.error('Add product failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to create the product.' });
  }
}
