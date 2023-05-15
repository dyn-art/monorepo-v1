import { LOG_LEVEL, Logger } from '@pda/logger';

export const uiLogger = new Logger({
  prefix: '@pda/figma-handler - UI',
  level: LOG_LEVEL.INFO,
});
