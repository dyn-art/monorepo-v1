import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: `.env` });

// Import Configs
import appConfig from './app.config';
import etsyConfig from './etsy.config';
import s3Config from './s3.config';

export const config = {
  app: appConfig,
  etsy: etsyConfig,
  s3: s3Config,
};
export * from './types';
export { appConfig, etsyConfig };

export default config;
