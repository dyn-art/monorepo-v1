import { LOG_LEVEL, Logger } from '@pda/logger';

export const logger = new Logger({
  prefix: '@pda/client-utils',
  level: LOG_LEVEL.INFO,
});
