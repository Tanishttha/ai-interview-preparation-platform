import { PrismaClient } from '@prisma/client';
import { readDb, writeDb } from '../repositories/db_fallback';

let prisma: PrismaClient | null = null;
let isPrismaActive = false;

if (process.env.DATABASE_URL) {
  try {
    prisma = new PrismaClient();
    isPrismaActive = true;
    console.log("Prisma Client loaded successfully using DATABASE_URL.");
  } catch (err) {
    console.warn("Failed to initialize Prisma Client with DATABASE_URL. Falling back to JSON database.", err);
    prisma = null;
    isPrismaActive = false;
  }
} else {
  console.log("No DATABASE_URL environment variable found. Defaulting to high-performance JSON file storage.");
}

export { prisma, isPrismaActive, readDb, writeDb };
