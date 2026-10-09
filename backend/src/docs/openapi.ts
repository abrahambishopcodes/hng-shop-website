import { OpenAPIRegistry, OpenApiGeneratorV31, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Must run before any z.* schema is created in this file
extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

// ---- Security ----

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// ---- Reusable component schemas ----

const CategorySchema = registry.register(
  'Category',
  z.object({ id: z.string().uuid(), name: z.string() }).openapi('Category'),
);

const SellerSchema = registry.register(
  'Seller',
  z.object({ id: z.string().uuid(), fullName: z.string(), email: z.string().email() }).openapi('Seller'),
);

const ProductSchema = registry.register(
  'Product',
  z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    price: z.string().openapi({ example: '29.99', description: 'Decimal serialised as string' }),
    discount: z.string().nullable().openapi({ example: '10.00' }),
    productImageKey: z.string().nullable(),
    noInStock: z.number().int(),
    freeDelivery: z.boolean(),
    sellerId: z.string().uuid(),
    seller: SellerSchema,
    categories: z.array(CategorySchema),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }).openapi('Product'),
);

const CartItemSchema = registry.register(
  'CartItem',
  z.object({
    id: z.string().uuid(),
    cartId: z.string().uuid(),
    productId: z.string().uuid(),
    quantity: z.number().int(),
    product: z.object({
      id: z.string().uuid(),
      title: z.string(),
      price: z.string(),
      discount: z.string().nullable(),
      productImageKey: z.string().nullable(),
      noInStock: z.number().int(),
      freeDelivery: z.boolean(),
    }),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }).openapi('CartItem'),
);

const CartSchema = registry.register(
  'Cart',
  z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    items: z.array(CartItemSchema),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }).openapi('Cart'),
);

const WishlistEntrySchema = registry.register(
  'WishlistEntry',
  z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    productId: z.string().uuid(),
    product: z.object({
      id: z.string().uuid(),
      title: z.string(),
      price: z.string(),
      discount: z.string().nullable(),
      productImageKey: z.string().nullable(),
      noInStock: z.number().int(),
      freeDelivery: z.boolean(),
      categories: z.array(CategorySchema),
    }),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }).openapi('WishlistEntry'),
);

const TokenResponseSchema = registry.register(
  'TokenResponse',
  z.object({
    accessToken: z.string(),
    user: z.object({
      id: z.string().uuid(),
      fullName: z.string(),
      email: z.string().email(),
      role: z.enum(['Admin', 'User']),
      avatarUrl: z.string().nullable(),
    }),
  }).openapi('TokenResponse'),
);

const PaginationSchema = registry.register(
  'Pagination',
  z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }).openapi('Pagination'),
);

// ---- Request / param schemas (inline — same shape as validation schemas) ----

const SignUpBodySchema = registry.register(
  'SignUpBody',
  z.object({
    fullName: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(320),
    password: z.string().min(8).max(128),
  }).openapi('SignUpBody'),
);

const LoginBodySchema = registry.register(
  'LoginBody',
  z.object({
    email: z.string().trim().email().max(320),
    password: z.string().min(8).max(128),
  }).openapi('LoginBody'),
);

const AddProductBodySchema = registry.register(
  'AddProductBody',
  z.object({
    title: z.string().trim().min(1).max(255),
    description: z.string().trim().min(1),
    price: z.number().positive(),
    discount: z.number().min(0).max(100).optional(),
    productImageKey: z.string().optional(),
    noInStock: z.number().int().min(0),
    freeDelivery: z.boolean().default(false),
    categories: z.array(z.string().trim().min(1)).min(1),
  }).openapi('AddProductBody'),
);

const UpdateProductBodySchema = registry.register(
  'UpdateProductBody',
  z.object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().min(1).optional(),
    price: z.number().positive().optional(),
    discount: z.number().min(0).max(100).optional(),
    productImageKey: z.string().optional(),
    noInStock: z.number().int().min(0).optional(),
    freeDelivery: z.boolean().optional(),
    categories: z.array(z.string().trim().min(1)).min(1).optional(),
  }).openapi('UpdateProductBody'),
);

const AddToCartBodySchema = registry.register(
  'AddToCartBody',
  z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).default(1),
  }).openapi('AddToCartBody'),
);

const UpdateCartItemBodySchema = registry.register(
  'UpdateCartItemBody',
  z.object({ quantity: z.number().int().min(1) }).openapi('UpdateCartItemBody'),
);

const ProductIdParamSchema = z.object({ id: z.string().uuid() });
const CartItemIdParamSchema = z.object({ itemId: z.string().uuid() });
const WishlistParamSchema = z.object({ productId: z.string().uuid() });
const ProductQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
  limit: z.coerce.number().int().min(1).max(100).default(20).openapi({ example: 20 }),
  category: z.string().optional(),
});

// ---- Helpers ----

const auth = [{ bearerAuth: [] }];
const json = (schema: z.ZodType) => ({ content: { 'application/json': { schema } } });
const err = (description: string) => ({ ...json(z.object({ message: z.string() })), description });

// ---- Auth paths ----

registry.registerPath({
  method: 'post', path: '/auth/signup', tags: ['Auth'], summary: 'Create a new account',
  request: { body: { required: true, ...json(SignUpBodySchema) } },
  responses: {
    201: { description: 'Account created', ...json(TokenResponseSchema) },
    400: err('Validation error'),
    409: err('Email already in use'),
  },
});

registry.registerPath({
  method: 'post', path: '/auth/login', tags: ['Auth'], summary: 'Sign in',
  request: { body: { required: true, ...json(LoginBodySchema) } },
  responses: {
    200: { description: 'Signed in', ...json(TokenResponseSchema) },
    400: err('Validation error'),
    401: err('Invalid credentials'),
  },
});

registry.registerPath({
  method: 'post', path: '/auth/refresh', tags: ['Auth'], summary: 'Refresh access token',
  responses: {
    200: { description: 'New access token', ...json(z.object({ accessToken: z.string() })) },
    401: err('Invalid or missing refresh token'),
  },
});

registry.registerPath({
  method: 'get', path: '/auth/google', tags: ['Auth'], summary: 'Initiate Google OAuth',
  responses: { 302: { description: 'Redirect to Google consent screen' } },
});

registry.registerPath({
  method: 'get', path: '/auth/me', tags: ['Auth'], summary: 'Get current session user',
  responses: { 200: { description: 'Session user or null', ...json(z.object({ user: z.unknown() })) } },
});

registry.registerPath({
  method: 'post', path: '/auth/logout', tags: ['Auth'], summary: 'Sign out',
  responses: { 204: { description: 'Signed out, cookies cleared' } },
});

// ---- Product paths ----

registry.registerPath({
  method: 'get', path: '/products', tags: ['Products'], summary: 'List products',
  request: { query: ProductQuerySchema },
  responses: {
    200: { description: 'Paginated list', ...json(z.object({ products: z.array(ProductSchema), pagination: PaginationSchema })) },
  },
});

registry.registerPath({
  method: 'post', path: '/products', tags: ['Products'], summary: 'Add a product',
  security: auth,
  request: { body: { required: true, ...json(AddProductBodySchema) } },
  responses: {
    201: { description: 'Product created', ...json(z.object({ product: ProductSchema })) },
    400: err('Validation error'),
    401: err('Unauthenticated'),
    403: err('Admin only'),
  },
});

registry.registerPath({
  method: 'patch', path: '/products/{id}', tags: ['Products'], summary: 'Update a product',
  security: auth,
  request: { params: ProductIdParamSchema, body: { required: true, ...json(UpdateProductBodySchema) } },
  responses: {
    200: { description: 'Product updated', ...json(z.object({ product: ProductSchema })) },
    400: err('Validation error'),
    401: err('Unauthenticated'),
    403: err('Admin only'),
    404: err('Not found'),
  },
});

registry.registerPath({
  method: 'delete', path: '/products/{id}', tags: ['Products'], summary: 'Delete a product',
  security: auth,
  request: { params: ProductIdParamSchema },
  responses: {
    204: { description: 'Deleted' },
    401: err('Unauthenticated'),
    403: err('Admin only'),
    404: err('Not found'),
  },
});

// ---- Cart paths ----

registry.registerPath({
  method: 'get', path: '/cart', tags: ['Cart'], summary: 'Get cart (created on first access)',
  security: auth,
  responses: {
    200: { description: 'Cart with items', ...json(z.object({ cart: CartSchema })) },
    401: err('Unauthenticated'),
    403: err('Account deactivated'),
  },
});

registry.registerPath({
  method: 'post', path: '/cart/items', tags: ['Cart'], summary: 'Add item to cart',
  security: auth,
  request: { body: { required: true, ...json(AddToCartBodySchema) } },
  responses: {
    201: { description: 'Item added', ...json(z.object({ item: CartItemSchema })) },
    400: err('Validation error'),
    401: err('Unauthenticated'),
    404: err('Product not found'),
    409: err('Already in cart or insufficient stock'),
  },
});

registry.registerPath({
  method: 'patch', path: '/cart/items/{itemId}', tags: ['Cart'], summary: 'Update cart item quantity',
  security: auth,
  request: { params: CartItemIdParamSchema, body: { required: true, ...json(UpdateCartItemBodySchema) } },
  responses: {
    200: { description: 'Item updated', ...json(z.object({ item: CartItemSchema })) },
    400: err('Validation error'),
    401: err('Unauthenticated'),
    404: err('Item not found'),
  },
});

registry.registerPath({
  method: 'delete', path: '/cart/items/{itemId}', tags: ['Cart'], summary: 'Remove item from cart',
  security: auth,
  request: { params: CartItemIdParamSchema },
  responses: {
    204: { description: 'Removed' },
    401: err('Unauthenticated'),
    404: err('Item not found'),
  },
});

// ---- Wishlist paths ----

registry.registerPath({
  method: 'post', path: '/wishlist/{productId}', tags: ['Wishlist'], summary: 'Add product to wishlist',
  security: auth,
  request: { params: WishlistParamSchema },
  responses: {
    201: { description: 'Added', ...json(z.object({ wishlist: WishlistEntrySchema })) },
    401: err('Unauthenticated'),
    404: err('Product not found'),
    409: err('Already in wishlist'),
  },
});

registry.registerPath({
  method: 'delete', path: '/wishlist/{productId}', tags: ['Wishlist'], summary: 'Remove product from wishlist',
  security: auth,
  request: { params: WishlistParamSchema },
  responses: {
    204: { description: 'Removed' },
    401: err('Unauthenticated'),
    404: err('Not in wishlist'),
  },
});

// ---- Spec generator ----

let cachedSpec: ReturnType<OpenApiGeneratorV31['generateDocument']> | null = null;

export function generateOpenApiSpec() {
  if (cachedSpec) return cachedSpec;

  const generator = new OpenApiGeneratorV31(registry.definitions);
  cachedSpec = generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Morrow Goods API',
      version: '1.0.0',
      description: 'REST API for the Morrow Goods e-commerce platform.',
    },
    servers: [{ url: '/api/v1', description: 'Current server' }],
  });

  return cachedSpec;
}
