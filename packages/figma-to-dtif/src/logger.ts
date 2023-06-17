import { LOG_LEVEL, Logger } from '@pda/logger';

export const logger = new Logger({
  prefix: '@pda/figma-to-dtif',
  level: LOG_LEVEL.INFO,
});
