import { LOG_LEVEL, Logger } from '@dyn/logger';

export const logger = new Logger({
  prefix: '@dyn/web',
  level: LOG_LEVEL.INFO,
});
