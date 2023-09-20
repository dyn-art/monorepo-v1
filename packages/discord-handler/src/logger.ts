import { LOG_LEVEL, Logger } from '@dyn/logger';

export const logger = new Logger({
  prefix: '@dyn/discord-handler',
  level: LOG_LEVEL.INFO,
});
