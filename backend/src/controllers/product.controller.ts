import type { Request, Response } from 'express';
import type { z } from 'zod';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { prisma } from '../lib/db.js';
import type {
  AddProductSchema,
  ProductParamSchema,
  ProductQuerySchema,
  UpdateProductSchema,
} from '../schemas/product.schemas.js';

const productInclude = {
  categories: { select: { id: true, name: true } },
  seller: { select: { id: true, fullName: true, email: true } },
} as const;

export async function getProducts(request: Request, response: Response): Promise<void> {
  const { page, limit, category } = request.query as unknown as z.infer<typeof ProductQuerySchema>;

  const where = category ? { categories: { some: { name: category } } } : {};
  const skip = (page - 1) * limit;

  try {
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: productInclude,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    response.json({
      products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Get products failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to fetch products.' });
  }
}

export async function addProduct(request: Request, response: Response): Promise<void> {
  const {
    title,
    description,
    price,
    discount,
    productImageKey,
    noInStock,
    freeDelivery,
    categories,
  } = request.body as z.infer<typeof AddProductSchema>;
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
      include: productInclude,
    });

    response.status(201).json({ product });
  } catch (error) {
    console.error('Add product failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to create the product.' });
  }
}

export async function updateProduct(request: Request, response: Response): Promise<void> {
  const { id } = request.params as z.infer<typeof ProductParamSchema>;
  const { categories, ...fields } = request.body as z.infer<typeof UpdateProductSchema>;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...fields,
        ...(categories && {
          categories: {
            set: [],
            connectOrCreate: categories.map((name) => ({
              where: { name },
              create: { name },
            })),
          },
        }),
      },
      include: productInclude,
    });

    response.json({ product });
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      response.status(404).json({ message: 'Product not found.' });
      return;
    }
    console.error('Update product failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to update the product.' });
  }
}

export async function deleteProduct(request: Request, response: Response): Promise<void> {
  const { id } = request.params as z.infer<typeof ProductParamSchema>;

  try {
    await prisma.product.delete({ where: { id } });
    response.status(204).end();
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      response.status(404).json({ message: 'Product not found.' });
      return;
    }
    console.error('Delete product failed:', (error as Error).message);
    response.status(500).json({ message: 'Unable to delete the product.' });
  }
}
