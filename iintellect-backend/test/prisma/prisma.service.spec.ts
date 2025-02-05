import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.user.deleteMany();
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
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
      first_name: 'John',
      last_name: 'Doe',
      second_name: 'Michael',
      phone: '1234567890',
    };

    it('should create a user', async () => {
      const user = await prismaService.user.create({ data: mockUser });
      expect(user).toHaveProperty('id');
      expect(user.username).toBe(mockUser.username);
      expect(user.email).toBe(mockUser.email);
    });

    it('should find all users', async () => {
      await prismaService.user.create({ data: mockUser });
      const users = await prismaService.user.findMany();
      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBeGreaterThan(0);
    });

    it('should update a user', async () => {
      const user = await prismaService.user.create({ data: mockUser });
      const updatedUser = await prismaService.user.update({
        where: { id: user.id },
        data: { username: 'updateduser' },
      });
      expect(updatedUser.username).toBe('updateduser');
    });

    it('should delete a user', async () => {
      const user = await prismaService.user.create({ data: mockUser });
      const deletedUser = await prismaService.user.delete({
        where: { id: user.id },
      });
      expect(deletedUser.id).toBe(user.id);
    });
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });
});