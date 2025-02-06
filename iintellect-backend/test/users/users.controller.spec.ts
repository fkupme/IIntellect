import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/user/user.controller';
import { UserService } from '../../src/user/user.service';
import { CreateUserDto, UpdateUserDto } from '../../src/DTO/user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MockUser } from './MockUser';
import { AuthService } from '@/auth/auth.service'
import { AuthController } from '@/auth/auth.controller'

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController, AuthController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            validateCredentials: jest.fn(),
            validateUser: jest.fn(),
            validateOAuthUser: jest.fn(),

          }
        }
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService); 
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return a JWT', async () => {
      const mockUser = MockUser.create();
      jest.spyOn(service, 'create').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'login').mockResolvedValue({ access_token: 'mock-jwt-token' });

      const createUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        second_name: 'Michael',
        phone: '+1234567890',
      };

      const result = await controller.create(createUserDto);
      expect(result).toEqual( {access_token: 'mock-jwt-token' });
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });

    it('should throw an error if user already exists', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(
        new HttpException('Пользователь с таким email уже существует', HttpStatus.CONFLICT),
      );

      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        second_name: 'Michael',
        phone: '+1234567890',
      };

      await expect(controller.create(createUserDto)).rejects.toThrow(
        new HttpException('Пользователь с таким email уже существует', HttpStatus.CONFLICT),
      );
    });


  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [MockUser.create(), MockUser.create({ id: 2, username: 'user2' })];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockUsers);

      const result = await controller.findAll();
      expect(result).toEqual(mockUsers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUser = MockUser.create();
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(
        new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND),
      );

      await expect(controller.findOne('999')).rejects.toThrow(
        new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const mockUser = MockUser.create();
      jest.spyOn(service, 'update').mockResolvedValue(mockUser);

      const updateUserDto: UpdateUserDto = { username: 'updateduser' };
      const result = await controller.update('1', updateUserDto);

      expect(result).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(
        new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND),
      );

      const updateUserDto: UpdateUserDto = { username: 'updateduser' };
      await expect(controller.update('999', updateUserDto)).rejects.toThrow(
        new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const mockUser = MockUser.create();
      jest.spyOn(service, 'remove').mockResolvedValue(mockUser);

      const result = await controller.remove(1);
      expect(result).toEqual(mockUser);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(
        new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND),
      );

      await expect(controller.remove(999)).rejects.toThrow(
        new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND),
      );
    });
  });
});