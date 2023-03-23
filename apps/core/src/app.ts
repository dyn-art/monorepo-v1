import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import config from './environment/config';
import { errorMiddlewares, rateLimiterMiddleware } from './middlewares';
import routes from './routes';

const app: Express = express();

// Add logging middleware for development
app.use(logger('dev'));

// Add Helmet middleware to protect against common web vulnerabilities
app.use(helmet());

// Configure CORS (Cross-Origin Resource Sharing) middleware
app.use(
  cors({
    origin: config.app.corsOrigins,
    credentials: true, // Enable Access-Control-Allow-Credentials
  })
);

// Enable 'trust proxy' to reveal the real client IP address for rate limiting
app.set('trust proxy', 1);

// Add rate limiting middleware
app.use(rateLimiterMiddleware);

// Add middleware to parse JSON request bodies
app.use(express.json());

// Register application routes
app.use('/', routes);

// Add error handling middlewares
app.use(...errorMiddlewares);

export default app;
