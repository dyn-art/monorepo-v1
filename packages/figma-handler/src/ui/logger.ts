import { LOG_LEVEL, Logger } from '@dyn/logger';

export const uiLogger = new Logger({
  prefix: '@dyn/figma-handler - UI',
  level: LOG_LEVEL.INFO,
});
