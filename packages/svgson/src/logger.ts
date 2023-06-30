import { LOG_LEVEL, Logger } from '@pda/logger';

export const logger = new Logger({
  prefix: '@pda/svgson',
  level: LOG_LEVEL.INFO,
});
