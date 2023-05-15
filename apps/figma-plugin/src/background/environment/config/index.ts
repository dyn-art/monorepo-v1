import { logger } from '../../../shared';
import appConfig from './app.config';

export const config = {
  app: appConfig,
};
export { appConfig };

logger.info(`Loaded configuration object.`, config);

export default config;
