import { LOG_LEVEL, Logger } from '@pda/logger';

export const logger = new Logger({
  prefix: '@pda/core-client',
  level: LOG_LEVEL.INFO,
});
