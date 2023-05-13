import { LOG_LEVEL, Logger } from '@pda/logger';

export const logger = new Logger({
  prefix: 'PDA Figma Plugin',
  level: LOG_LEVEL.INFO,
});
