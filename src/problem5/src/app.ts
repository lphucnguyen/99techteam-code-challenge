import express from 'express';
import { initPostRoute } from './routes/postRoutes';
import errorHandler from './middlewares/errorHandlerMiddleware';

const app = express();

app.use(express.json());

const postRouter = initPostRoute();

app.use('/posts', postRouter);

app.use(errorHandler);

export default app;