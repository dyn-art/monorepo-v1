import { LOG_LEVEL, Logger } from '@dyn/logger';

export const logger = new Logger({
  prefix: '@dyn/etsy-client',
  level: LOG_LEVEL.INFO,
});
