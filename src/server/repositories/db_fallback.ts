/**
 * @deprecated
 * JSON fallback storage has been removed.
 * The backend now uses Prisma + MongoDB exclusively.
 */

export const readDb = () => {
  throw new Error('db.json fallback has been removed. Use Prisma repositories instead.');
};

export const writeDb = () => {
  throw new Error('db.json fallback has been removed. Use Prisma repositories instead.');
};
