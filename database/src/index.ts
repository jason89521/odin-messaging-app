import { PrismaClient } from '@prisma/client';

export function getDBClient() {
  return new PrismaClient();
}
