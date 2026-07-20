import { prisma, isPrismaActive, readDb, writeDb } from '../config/db';

export class CompanyRepository {
  async getAll(search?: string, difficulty?: string) {
    if (isPrismaActive && prisma) {
      return prisma.company.findMany({
        where: {
          AND: [
            search ? { name: { contains: search, mode: 'insensitive' } } : {},
            difficulty ? { difficulty } : {}
          ]
        },
        include: { rounds: true }
      });
    } else {
      const db = readDb();
      let list = db.companies || [];
      if (search) {
        list = list.filter((c: any) => c.name.toLowerCase().includes(search.toLowerCase()));
      }
      if (difficulty) {
        list = list.filter((c: any) => c.difficulty.toLowerCase() === difficulty.toLowerCase());
      }
      return list;
    }
  }

  async findById(id: string) {
    if (isPrismaActive && prisma) {
      return prisma.company.findUnique({
        where: { id },
        include: { rounds: true }
      });
    } else {
      const db = readDb();
      return db.companies.find((c: any) => c.id === id) || null;
    }
  }

  async create(data: any) {
    if (isPrismaActive && prisma) {
      return prisma.company.create({ data });
    } else {
      const db = readDb();
      const newCompany = { id: `c_${Date.now()}`, ...data };
      db.companies.push(newCompany);
      writeDb(db);
      return newCompany;
    }
  }
}
