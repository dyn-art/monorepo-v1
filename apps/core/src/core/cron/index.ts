import cron from 'node-cron';
import { processReceipts } from '../services';

export const cronTasks: cron.ScheduledTask[] = [
  // Etsy Orders/Receipts polling Cron Schedule (Runs all 5min)
  cron.schedule(
    '*/5 * * * *',
    async () => {
      console.log('Running Etsy orders polling task...');
      await processReceipts();
    },
    { scheduled: false }
  ),
];
