import { LOG_LEVEL, Logger } from '@pda/logger';

export const logger = new Logger({
  prefix: '@pda/etsy',
  level: LOG_LEVEL.INFO,
});
