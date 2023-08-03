import { LOG_LEVEL, Logger } from '@pda/logger';

export const logger = new Logger({
  prefix: '@pda/figma-to-svg',
  level: LOG_LEVEL.INFO,
});
