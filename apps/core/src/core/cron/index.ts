import cron from 'node-cron';
import { logger } from '../../logger';

export const cronTasks: cron.ScheduledTask[] = [
  // Etsy Orders/Receipts polling Cron Schedule (Runs all 5min)
  cron.schedule(
    '*/5 * * * *',
    async () => {
      logger.info('Started running Etsy orders polling task...');
      // await processReceipts();
      logger.info('Completed Etsy orders polling task.');
    },
    { scheduled: false }
  ),
];
