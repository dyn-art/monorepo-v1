import { LOG_LEVEL, Logger } from '@dyn/logger';

export const logger = new Logger({
  prefix: '@dyn/dtif-to-react',
  level: LOG_LEVEL.INFO,
});
