import type { Request, Response } from 'express';
import type { z } from 'zod';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { prisma } from '../lib/db.js';
import type {
  AddToCartSchema,
  CartItemParamSchema,
  UpdateCartItemSchema,
} from '../schemas/cart.schemas.js';

const cartInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          title: true,
          price: true,
          discount: true,
          productImageKey: true,
          noInStock: true,
          freeDelivery: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
} as const;

async function upsertCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: cartInclude,
  });
}

export async function getCart(request: Request, response: Response): Promise<void> {
  const { userId } = (request as AuthenticatedRequest).auth!;

  try {
    const cart = await upsertCart(userId);
    response.json({ cart });
  } catch (error) {
    console.error('Get cart failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to fetch cart.' });
  }
}

export async function addToCart(request: Request, response: Response): Promise<void> {
  const { productId, quantity } = request.body as z.infer<typeof AddToCartSchema>;
  const { userId } = (request as AuthenticatedRequest).auth!;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, noInStock: true },
    });
    if (!product) {
      response.status(404).json({ message: 'Product not found.' });
      return;
    }
    if (product.noInStock < quantity) {
      response.status(409).json({ message: 'Requested quantity exceeds available stock.' });
      return;
    }

    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const item = await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            discount: true,
            productImageKey: true,
            noInStock: true,
            freeDelivery: true,
          },
        },
      },
    });

    response.status(201).json({ item });
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002') {
      response
        .status(409)
        .json({ message: 'Product is already in cart. Update its quantity instead.' });
      return;
    }
    console.error('Add to cart failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to add item to cart.' });
  }
}

export async function updateCartItem(request: Request, response: Response): Promise<void> {
  const { itemId } = request.params as z.infer<typeof CartItemParamSchema>;
  const { quantity } = request.body as z.infer<typeof UpdateCartItemSchema>;
  const { userId } = (request as AuthenticatedRequest).auth!;

  try {
    const cart = await prisma.cart.findUnique({ where: { userId }, select: { id: true } });
    if (!cart) {
      response.status(404).json({ message: 'Cart not found.' });
      return;
    }

    const item = await prisma.cartItem.update({
      where: { id: itemId, cartId: cart.id },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            discount: true,
            productImageKey: true,
            noInStock: true,
            freeDelivery: true,
          },
        },
      },
    });

    response.json({ item });
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      response.status(404).json({ message: 'Cart item not found.' });
      return;
    }
    console.error('Update cart item failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to update cart item.' });
  }
}

export async function removeFromCart(request: Request, response: Response): Promise<void> {
  const { itemId } = request.params as z.infer<typeof CartItemParamSchema>;
  const { userId } = (request as AuthenticatedRequest).auth!;

  try {
    const cart = await prisma.cart.findUnique({ where: { userId }, select: { id: true } });
    if (!cart) {
      response.status(404).json({ message: 'Cart not found.' });
      return;
    }

    await prisma.cartItem.delete({ where: { id: itemId, cartId: cart.id } });
    response.status(204).end();
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      response.status(404).json({ message: 'Cart item not found.' });
      return;
    }
    console.error('Remove from cart failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to remove item from cart.' });
  }
}
