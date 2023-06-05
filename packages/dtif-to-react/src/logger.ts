import { LOG_LEVEL, Logger } from '@pda/logger';

export const logger = new Logger({
  prefix: '@pda/dtif-to-react',
  level: LOG_LEVEL.INFO,
});
