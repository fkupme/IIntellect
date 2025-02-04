import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateUserDto } from '../../src/dto/create-user.dto';
import { UpdateUserDto } from '../../src/dto/update-user.dto';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        phone: '+1234567890',
        first_name: 'John',
        last_name: 'Doe',
        second_name: 'Michael',
      };

      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);

      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        second_name: 'Michael',
        phone: '1234567890',
      };

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password_hash: expect.any(String),
          role: 'user',
        },
      });
    });

    it('should throw an error if user already exists', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
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
      });

      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        second_name: 'Michael',
        phone: '1234567890',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Пользователь с таким email уже существует',
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: 1,
          username: 'user1',
          email: 'user1@example.com',
          password_hash: 'hashed_password_1',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date(),
          phone: null,
          first_name: null,
          last_name: null,
          second_name: null,
        },
        {
          id: 2,
          username: 'user2',
          email: 'user2@example.com',
          password_hash: 'hashed_password_2',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date(),
          phone: null,
          first_name: null,
          last_name: null,
          second_name: null,
        },
      ];
  
      jest.spyOn(prisma.user, 'findMany').mockResolvedValue(mockUsers);
  
      const result = await service.findAll();
  
      expect(result).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password_hash: 'hashed_password_1',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        phone: null,
        first_name: null,
        last_name: null,
        second_name: null,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('Пользователь не найден');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const mockUser = {
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password_hash: 'hashed_password_1',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        phone: null,
        first_name: null,
        last_name: null,
        second_name: null,
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password_hash: 'hashed_password_1',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        phone: null,
        first_name: null,
        last_name: null,
        second_name: null,
      });
      jest.spyOn(prisma.user, 'update').mockResolvedValue(mockUser);

      const updateUserDto: UpdateUserDto = { username: 'updateduser' };

      const result = await service.update(1, updateUserDto);

      expect(result).toEqual(mockUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateUserDto,
      });
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      const updateUserDto: UpdateUserDto = { username: 'updateduser' };

      await expect(service.update(999, updateUserDto)).rejects.toThrow('Пользователь не найден');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password_hash: 'hashed_password_1',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        phone: null,
        first_name: null,
        last_name: null,
        second_name: null,
      });
      jest.spyOn(prisma.user, 'delete').mockResolvedValue({
        id: 1,
        username: 'user1',
        email: 'user1@example.com',
        password_hash: 'hashed_password_1',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        phone: null,
        first_name: null,
        last_name: null,
        second_name: null,
      });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow('Пользователь не найден');
    });
  });
});