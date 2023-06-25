import { errorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { errorLoggerMiddleware } from './middlewares/error-logger.middleware';
import { invalidPathHandlerMiddleware } from './middlewares/invalid-path.middleware';

export * from './AppError';

export const errorMiddlewares = [
  invalidPathHandlerMiddleware,
  errorLoggerMiddleware,
  errorHandlerMiddleware,
];

export {
  errorHandlerMiddleware,
  errorLoggerMiddleware,
  invalidPathHandlerMiddleware,
};
