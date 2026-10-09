import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { apiReference } from '@scalar/express-api-reference';
import { env } from './config/environment.js';
import { passport } from './config/passport.js';
import { generateOpenApiSpec } from './docs/openapi.js';
import { authRouter } from './routes/auth.routes.js';
import { CartRouter } from './routes/cart.routes.js';
import { ProductRouter } from './routes/product.routes.js';
import { WishlistRouter } from './routes/wishlist.routes.js';

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/v1', authRouter);
app.use('/api/v1', ProductRouter);
app.use('/api/v1', CartRouter);
app.use('/api/v1', WishlistRouter);

app.get('/openapi.json', (_req, res) => res.json(generateOpenApiSpec()));
app.use('/docs', apiReference({ spec: { url: '/openapi.json' } }));

app.listen(env.port, () => {
  console.log(`Morrow Goods backend  →  http://localhost:${env.port}`);
  console.log(`API docs              →  http://localhost:${env.port}/docs`);
});
