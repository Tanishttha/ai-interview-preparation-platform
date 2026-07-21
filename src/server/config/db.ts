import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required.');
}

prisma = new PrismaClient();
console.log('Prisma Client loaded successfully using DATABASE_URL.');

export { prisma };
