import { LOG_LEVEL, Logger } from '@pda/logger';

export const logger = new Logger({
  prefix: '@pda/openapi-fetch',
  level: LOG_LEVEL.INFO,
});
