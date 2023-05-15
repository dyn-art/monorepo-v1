import { LOG_LEVEL, Logger } from '@pda/logger';

export const backgroundLogger = new Logger({
  prefix: '@pda/figma-handler - Background',
  level: LOG_LEVEL.INFO,
});
