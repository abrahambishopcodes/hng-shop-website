import { Router } from 'express';
import { addProduct } from '../controllers/product.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { AddProductSchema } from '../schemas/product.schemas.js';

const router = Router();

router.post('/', authenticate, requireAdmin, validate({ body: AddProductSchema }), addProduct);

export const ProductRouter = Router();
ProductRouter.use('/products', router);
