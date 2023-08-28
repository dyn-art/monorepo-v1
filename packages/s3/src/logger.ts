import { LOG_LEVEL, Logger } from '@dyn/logger';

export const logger = new Logger({
  prefix: '@dyn/s3',
  level: LOG_LEVEL.INFO,
});
