import { Prisma, PrismaClient } from '@prisma/client';
import { appConfig, STAGE } from '../../environment';

export class PrismaConnection {
  private db: PrismaClient | null = null;

  /**
   * Connect to the database and initialize the PrismaClient instance
   */
  public connectDB(): PrismaClient {
    const logs: Record<string, Prisma.LogDefinition> = {}; // <level, emit>
    logs['error'] = { level: 'error', emit: 'stdout' };
    if (appConfig.stage === STAGE.LOCAL) {
      logs['query'] = { level: 'query', emit: 'event' };
    }

    // Initialize Prisma instance
    if (this.db === null) {
      this.db = new PrismaClient({
        log: Object.keys(logs).map((key) => logs[key]),
      });

      // Register Events
      if (logs['query'] != null && logs['query'].emit === 'event') {
        this.db.$on('query' as any, (event: any) => {
          console.log(`Executed Query: `, event.query, {
            params: event.params,
            duration: event.duration + 'ms',
          });
        });
      }

      console.log('Successfully connected to database.');
    }

    return this.db;
  }

  /**
   * Close the database connection
   */
  public async closeDB(): Promise<void> {
    if (this.db !== null) {
      await this.db.$disconnect();
      console.log('Successfully closed the connection to the database.');
    }
  }

  /**
   * Get the PrismaClient instance, connecting to the database if needed
   */
  public getDB(): PrismaClient {
    return this.db ?? this.connectDB();
  }
}
