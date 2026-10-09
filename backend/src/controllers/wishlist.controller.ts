import type { Request, Response } from 'express';
import type { z } from 'zod';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { prisma } from '../lib/db.js';
import type { WishlistParamSchema } from '../schemas/wishlist.schemas.js';

export async function addToWishlist(request: Request, response: Response): Promise<void> {
  const { productId } = request.params as z.infer<typeof WishlistParamSchema>;
  const { userId } = (request as AuthenticatedRequest).auth!;

  try {
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!productExists) {
      response.status(404).json({ message: 'Product not found.' });
      return;
    }

    const entry = await prisma.wishlist.create({
      data: { userId, productId },
      include: { product: { include: { categories: { select: { id: true, name: true } } } } },
    });

    response.status(201).json({ wishlist: entry });
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002') {
      response.status(409).json({ message: 'Product is already in your wishlist.' });
      return;
    }
    console.error('Add to wishlist failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to add product to wishlist.' });
  }
}

export async function removeFromWishlist(request: Request, response: Response): Promise<void> {
  const { productId } = request.params as z.infer<typeof WishlistParamSchema>;
  const { userId } = (request as AuthenticatedRequest).auth!;

  try {
    await prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } },
    });

    response.status(204).end();
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      response.status(404).json({ message: 'Product is not in your wishlist.' });
      return;
    }
    console.error('Remove from wishlist failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to remove product from wishlist.' });
  }
}
