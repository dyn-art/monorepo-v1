import { LOG_LEVEL, Logger } from '@pda/logger';

export const backgroundLogger = new Logger({
  prefix: 'PDA Figma Handler Background',
  level: LOG_LEVEL.INFO,
});
