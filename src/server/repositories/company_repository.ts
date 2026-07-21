import { prisma } from '../config/db';

export class CompanyRepository {
  async getAll(search?: string, difficulty?: string) {
    return prisma.company.findMany({
      where: {
        AND: [
          search ? { name: { contains: search, mode: 'insensitive' } } : {},
          difficulty ? { difficulty } : {}
        ]
      },
      include: { rounds: true }
    });
  }

  async findById(id: string) {
    return prisma.company.findUnique({
      where: { id },
      include: { rounds: true }
    });
  }

  async create(data: any) {
    return prisma.company.create({ data });
  }
}
