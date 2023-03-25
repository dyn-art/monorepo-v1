import { PrismaConnection } from './PrismaConnection';

export * from './PrismaConnection';

export const dbConnection = new PrismaConnection();
export const db = dbConnection.getDB;
