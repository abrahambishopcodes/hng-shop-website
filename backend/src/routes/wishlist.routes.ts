import { Router } from 'express';
import { addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { WishlistParamSchema } from '../schemas/wishlist.schemas.js';

const router = Router();

router.post('/:productId', authenticate, validate({ params: WishlistParamSchema }), addToWishlist);
router.delete('/:productId', authenticate, validate({ params: WishlistParamSchema }), removeFromWishlist);

export const WishlistRouter = Router();
WishlistRouter.use('/wishlist', router);
