import { errorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { errorLoggerMiddleware } from './middlewares/error-logger.middleware';
import { invalidPathHandlerMiddleware } from './middlewares/invalid-path.middleware';

export const errorMiddlewares = [
  invalidPathHandlerMiddleware,
  errorLoggerMiddleware,
  errorHandlerMiddleware,
];
export * from './AppError';
export {
  errorHandlerMiddleware,
  errorLoggerMiddleware,
  invalidPathHandlerMiddleware,
};
