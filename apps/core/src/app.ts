import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morganLogger from 'morgan';
import { appConfig } from './environment';
import { logger } from './logger';
import {
  AppError,
  errorMiddlewares,
  rateLimiterMiddleware,
} from './middlewares';
import routes from './routes';

const app: Express = express();

// Add logging middleware for development
app.use(morganLogger('dev'));

// Add Helmet middleware to protect against common web vulnerabilities
app.use(helmet());

// Configure CORS (Cross-Origin Resource Sharing) middleware
app.use((req, res, next) => {
  cors({
    origin: (origin, callback) => {
      let valid = false;

      // TODO: Remove and create proxy for Figma Plugin for more secure handling
      // https://forum.figma.com/t/access-to-jira-api/8484
      // Check for temporary CORS API Key (e.g. for Figma Plugin which has not origin)
      const apiKey = req.header('X-CORS-API-KEY');
      if (req.method === 'OPTIONS' || apiKey === appConfig.corsApiKey) {
        valid = true;
      }

      // Check for CORS origins
      if (
        appConfig.corsOrigins === '*' ||
        appConfig.corsOrigins === origin ||
        (origin != null &&
          Array.isArray(appConfig.corsOrigins) &&
          appConfig.corsOrigins.includes(origin))
      ) {
        valid = true;
      }

      // Call callback
      if (valid) {
        callback(null, true);
      } else {
        logger.error(`Not allowed by CORS origin for '${origin}'!`, {
          allowedOrigins: appConfig.corsOrigins,
        });
        callback(
          new AppError(403, `Not allowed by CORS origin for '${origin}'!`)
        );
      }
    },
    credentials: true, // Enable Access-Control-Allow-Credentials
  })(req, res, next);
});

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
