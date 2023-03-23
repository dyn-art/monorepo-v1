import { createServer as createHttpServer } from 'http';
import { appConfig } from './environment';

async function initAsyncDependencies() {
  console.log('Initializing async modules...');

  // TODO: Initialize the database here

  console.log('Initialized async modules.');
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
    console.error(`Error: ${error.message}`);
  });
  httpServer.on('listening', () => {
    console.log(`Server running on Port: ${appConfig.port}`);
  });
})();
