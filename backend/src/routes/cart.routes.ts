import { Router } from 'express';
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from '../controllers/cart.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  AddToCartSchema,
  CartItemParamSchema,
  UpdateCartItemSchema,
} from '../schemas/cart.schemas.js';

const router = Router();

router.get('/', authenticate, getCart);
router.post('/items', authenticate, validate({ body: AddToCartSchema }), addToCart);
router.patch(
  '/items/:itemId',
  authenticate,
  validate({ params: CartItemParamSchema, body: UpdateCartItemSchema }),
  updateCartItem,
);
router.delete(
  '/items/:itemId',
  authenticate,
  validate({ params: CartItemParamSchema }),
  removeFromCart,
);

export const CartRouter = Router();
CartRouter.use('/cart', router);
