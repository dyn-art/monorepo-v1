import { LOG_LEVEL, Logger } from '@dyn/logger';

export const logger = new Logger({
  prefix: '@dyn/core',
  level: LOG_LEVEL.INFO,
});
