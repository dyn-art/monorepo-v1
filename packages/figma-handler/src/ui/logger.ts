import { LOG_LEVEL, Logger } from '@pda/logger';

export const uiLogger = new Logger({
  prefix: 'PDA Figma Handler UI',
  level: LOG_LEVEL.INFO,
});
