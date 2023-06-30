import helmet from 'helmet';
import { corsMiddleware } from './middlewares/cors.middleware';
import { rateLimiterMiddleware } from './middlewares/rate-limiter.middleware';

export const securityMiddlewares = [
  // Add Helmet middleware to protect against common web vulnerabilities
  helmet(),
  // Configure CORS (Cross-Origin Resource Sharing) middleware
  corsMiddleware,
  // Add rate limiting middleware
  rateLimiterMiddleware,
];

export { corsMiddleware, rateLimiterMiddleware };
