import { db } from '../../db';
import { etsyService } from './etsy';

export async function processReceipts() {
  const config = await db().configuration.findFirst();

  // Fetch latest orders
  const newOrders = await etsyService.getShopReceipts({
    min_last_modified: config?.last_poll_timestamp.getTime(),
  });

  // Update last polled timestamp in DB
  await updateLastPollTimestamp(new Date());

  // TODO: Process Orders
  console.log(newOrders);
}

async function updateLastPollTimestamp(timestamp: Date) {
  const config = await db().configuration.findFirst();
  if (config != null) {
    await db().configuration.update({
      where: { id: config.id },
      data: { last_poll_timestamp: timestamp },
    });
  } else {
    await db().configuration.create({
      data: {
        last_poll_timestamp: timestamp,
      },
    });
  }
}
