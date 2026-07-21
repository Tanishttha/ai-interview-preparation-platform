import { prisma } from '../config/db';

export interface UserDTO {
  id: string;
  email: string;
  firebaseUid?: string | null;
  passwordHash?: string | null;
  name: string;
  role: string;
  photoURL?: string | null;
}

export class UserRepository {
  async findByEmail(email: string): Promise<UserDTO | null> {
    return prisma.user.findUnique({ where: { email } }) as any;
  }

  async findById(id: string): Promise<UserDTO | null> {
    return prisma.user.findUnique({ where: { id } }) as any;
  }

  async findByFirebaseUid(firebaseUid: string): Promise<UserDTO | null> {
    return prisma.user.findUnique({ where: { firebaseUid } }) as any;
  }

  /**
   * Finds the local User row backing a given Firebase identity, creating it
   * on first sight (auto-provisioning) and backfilling firebaseUid if a user
   * with a matching email already exists (e.g. was seeded manually).
   */
  async findOrCreateByFirebaseIdentity(identity: {
    uid: string;
    email: string;
    name?: string | null;
    photoURL?: string | null;
  }): Promise<UserDTO> {
    const byUid = await this.findByFirebaseUid(identity.uid);
    if (byUid) return byUid;

    const byEmail = await this.findByEmail(identity.email);
    if (byEmail) {
      // Link this Firebase identity to the existing account
      return prisma.user.update({
        where: { id: byEmail.id },
        data: {
          firebaseUid: identity.uid,
          photoURL: byEmail.photoURL || identity.photoURL || null
        }
      }) as any;
    }

    return this.create({
      email: identity.email,
      firebaseUid: identity.uid,
      name: identity.name || identity.email.split('@')[0],
      passwordHash: null,
      role: 'CANDIDATE',
      photoURL: identity.photoURL || null
    });
  }

  async create(user: Omit<UserDTO, 'id'>): Promise<UserDTO> {
    return prisma.user.create({ data: user as any }) as any;
  }

  async getProfile(userId: string) {
    return prisma.profile.findUnique({ where: { userId } });
  }

  async updateProfile(userId: string, data: any) {
    return prisma.profile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    });
  }
}
