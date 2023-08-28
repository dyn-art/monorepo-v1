import { LOG_LEVEL, Logger } from '@dyn/logger';

export const logger = new Logger({
  prefix: '@dyn/figma-to-svg',
  level: LOG_LEVEL.INFO,
});
