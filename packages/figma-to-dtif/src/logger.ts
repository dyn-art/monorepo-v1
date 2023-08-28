import { LOG_LEVEL, Logger } from '@dyn/logger';

export const logger = new Logger({
  prefix: '@dyn/figma-to-dtif',
  level: LOG_LEVEL.INFO,
});
