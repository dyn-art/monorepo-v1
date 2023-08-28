import { LOG_LEVEL, Logger } from '@dyn/logger';

export const logger = new Logger({
  prefix: '@dyn/figma-plugin',
  level: LOG_LEVEL.INFO,
});
