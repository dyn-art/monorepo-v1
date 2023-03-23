import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: `.env` });

// Import Configs
import appConfig from './app.config';
import etsyConfig from './etsy.config';

export const config = {
  app: appConfig,
  etsy: etsyConfig,
};
export * from './types';
export { appConfig, etsyConfig };

console.log(`Loaded configuration object.`, config);

export default config;
