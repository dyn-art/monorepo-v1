import { LOG_LEVEL, Logger } from '@pda/logger';

export const logger = new Logger({
  prefix: '@pda/s3',
  level: LOG_LEVEL.INFO,
});
