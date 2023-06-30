import { createServer as createHttpServer } from 'http';
import { cronTasks } from './core/cron';
import { dbConnection } from './core/db';
import { logger } from './core/logger';
import { appConfig } from './environment';

async function initAsyncDependencies() {
  logger.info('Initializing async modules...');

  // Init DB connection
  dbConnection.connectDB();

  // Start cron tasks/jobs
  cronTasks.forEach((task) => task.start());

  logger.info('Initialized async modules.');
}

// Initialize the server
(async () => {
  // Load the async dependencies before starting the Express app
  await initAsyncDependencies();

  // Import the Express app module after async dependencies are initialized
  // This ensures that the app starts handling requests after all dependencies are ready
  const { default: app } = await import('./app');
  app.set('port', appConfig.port);

  // Create the HTTP server with the Express app as a request listener
  const httpServer = createHttpServer(app);
  httpServer.listen(appConfig.port);

  // Set up server event listeners
  httpServer.on('error', (error) => {
    logger.error(`Error occurred in http server: ${error.message}`);
  });
  httpServer.on('listening', () => {
    logger.info(`Server running on Port: ${appConfig.port}`);
  });
})();
