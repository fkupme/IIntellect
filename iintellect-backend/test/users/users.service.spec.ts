import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/user/user.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from '../../src/DTO/user.dto';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { MockUser } from './MockUser';

describe('UserService', () => {
  let service: UserService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
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

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10); // Генерация хэша
      const mockUser = MockUser.create({ password_hash: hashedPassword });
    
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null); // Нет существующего пользователя
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser); // Мок для create
    
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        second_name: 'Michael',
        phone: '+1234567890',
      };
    
      const result = await service.create(createUserDto);
    
      // Проверяем, что пароль хэшируется корректно
      const isPasswordValid = await bcrypt.compare(createUserDto.password, result.password_hash);
      expect(isPasswordValid).toBe(true);
    
      // Проверяем результат
      expect(result).toEqual(mockUser);
    
      // Проверяем вызов prisma.user.create
      const { password, ...userData } = createUserDto; // Убираем поле password
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...userData,
          password_hash: expect.any(String), // Хэшированный пароль
          role: 'user',
        },
      });
    });

    it('should throw an error if user already exists', async () => {
      const mockUser = MockUser.create({ email: 'existing@example.com' });
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        second_name: 'Michael',
        phone: '+1234567890',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException(
          'Пользователь с таким email уже существует',
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        MockUser.create(),
        MockUser.create({ id: 2, username: 'user2' }),
      ];
      jest.spyOn(prisma.user, 'findMany').mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUser = MockUser.create();
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const mockUser = MockUser.create();
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
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
      await expect(service.update(999, updateUserDto)).rejects.toThrow(
        new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const mockUser = MockUser.create();
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser); // Существующий пользователь
      jest.spyOn(prisma.user, 'delete').mockResolvedValue(mockUser); // Мок для delete
    
      const result = await service.remove(1);
      expect(result).toEqual(mockUser); // Проверяем результат
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
    
    it('should throw an error if user is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null); // Пользователь не найден
    
      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('User with ID 999 not found'),
      );
    });
  });
});
