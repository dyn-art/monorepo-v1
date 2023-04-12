import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: `.env` });

// Import Configs
import appConfig from './app.config';
import discordConfig from './discord.config';

export const config = {
  app: appConfig,
  discord: discordConfig,
};
export * from './types';
export { appConfig, discordConfig };

console.log(`Loaded configuration object.`, config);

export default config;
