import { LOG_LEVEL, Logger } from '@pda/logger';

export const logger = new Logger({
  prefix: 'PDA Discord Handler',
  level: LOG_LEVEL.INFO,
});
