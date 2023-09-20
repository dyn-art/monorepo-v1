import { LOG_LEVEL, Logger } from '@dyn/logger';

export const logger = new Logger({
  prefix: '@dyn/svgson',
  level: LOG_LEVEL.INFO,
});
