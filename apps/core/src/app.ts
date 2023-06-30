import express, { Express } from 'express';
import morganLogger from 'morgan';
import { errorMiddlewares, securityMiddlewares } from './middlewares';
import routes from './routes';

const app: Express = express();

// Enable 'trust proxy' to reveal the real client IP address for rate limiting
app.set('trust proxy', 1);

// Add logging middleware for development
app.use(morganLogger('dev'));

// Add security handling middlewares
app.use(...securityMiddlewares);

// Add middleware to parse JSON request bodies
app.use(express.json());

// Register application routes
app.use('/', routes);

// Add error handling middlewares
app.use(...errorMiddlewares);

export default app;
