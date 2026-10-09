import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config/environment.js';
import { passport } from './config/passport.js';
import { authRouter } from './routes/auth.routes.js';

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(authRouter);

app.listen(env.port, () => console.log(`Morrow Goods backend running at http://localhost:${env.port}`));
