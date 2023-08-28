import { LOG_LEVEL, Logger } from '@dyn/logger';

export const backgroundLogger = new Logger({
  prefix: '@dyn/figma-handler - Background',
  level: LOG_LEVEL.INFO,
});
