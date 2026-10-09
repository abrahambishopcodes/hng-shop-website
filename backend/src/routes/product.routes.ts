import { Router } from 'express';
import { addProduct, deleteProduct, getProducts, updateProduct } from '../controllers/product.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { AddProductSchema, ProductParamSchema, ProductQuerySchema, UpdateProductSchema } from '../schemas/product.schemas.js';

const router = Router();

router.get('/', validate({ query: ProductQuerySchema }), getProducts);
router.post('/', authenticate, requireAdmin, validate({ body: AddProductSchema }), addProduct);
router.patch('/:id', authenticate, requireAdmin, validate({ params: ProductParamSchema, body: UpdateProductSchema }), updateProduct);
router.delete('/:id', authenticate, requireAdmin, validate({ params: ProductParamSchema }), deleteProduct);

export const ProductRouter = Router();
ProductRouter.use('/products', router);
