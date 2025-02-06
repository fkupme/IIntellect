import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);

    try {
      await prismaService.user.deleteMany();
    } catch (error) {
      console.error('Error cleaning up database:', error);
    }
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('CRUD Operations', () => {
    const mockUser = {
      id: 1,
      username: 'existinguser',
      email: 'existing@example.com',
      password_hash: 'hashed_password',
      provider: 'local',
      provider_id: null,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
      first_name: 'John',
      last_name: 'Doe',
      second_name: 'Michael',
      phone: '1234567890',
    };

    it('should create a user', async () => {
      try {
        const user = await prismaService.user.create({ data: mockUser });
        expect(user).toHaveProperty('id');
        expect(user.username).toBe(mockUser.username);
        expect(user.email).toBe(mockUser.email);
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    });

    it('should find all users', async () => {
      try {
        await prismaService.user.create({ data: mockUser });
        const users = await prismaService.user.findMany();
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBeGreaterThan(0);
      } catch (error) {
        console.error('Error finding users:', error);
        throw error;
      }
    });

    it('should update a user', async () => {
      try {
        const user = await prismaService.user.create({ data: mockUser });
        const updatedUser = await prismaService.user.update({
          where: { id: user.id },
          data: { username: 'updateduser' },
        });
        expect(updatedUser.username).toBe('updateduser');
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    });

    it('should delete a user', async () => {
      try {
        const user = await prismaService.user.create({ data: mockUser });
        const deletedUser = await prismaService.user.delete({
          where: { id: user.id },
        });
        expect(deletedUser.id).toBe(user.id);
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    });

    it('should throw an error when creating a user with a duplicate email', async () => {
      try {
        await prismaService.user.create({ data: mockUser });
        await expect(
          prismaService.user.create({ data: { ...mockUser, id: 2 } }),
        ).rejects.toThrow(/Unique constraint failed/);
      } catch (error) {
        console.error('Error testing duplicate email:', error);
        throw error;
      }
    });
  });

  afterAll(async () => {
    try {
      await prismaService.$disconnect();
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  });
});