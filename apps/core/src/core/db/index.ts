import { PrismaConnection } from './PrismaConnection';

export * from './PrismaConnection';

export const dbConnection = new PrismaConnection();
export function db() {
  return dbConnection.getDB();
}
