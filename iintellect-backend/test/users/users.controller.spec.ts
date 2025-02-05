import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/user/user.controller';
import { UsersService } from '../../src/user/user.service';
import { CreateUserDto, UpdateUserDto } from '../../src/DTO/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
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
      jest.spyOn(service, 'create').mockResolvedValue(mockUser);

      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        second_name: 'A',
        phone: '1234567890',
      };

      const result = await controller.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
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

      jest.spyOn(service, 'findAll').mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(result).toEqual(mockUsers);
      expect(service.findAll).toHaveBeenCalled();
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

      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
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

      jest.spyOn(service, 'update').mockResolvedValue(mockUser);

      const updateUserDto: UpdateUserDto = { username: 'updateduser' };

      const result = await controller.update('1', updateUserDto);

      expect(result).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
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

      jest.spyOn(service, 'remove').mockResolvedValue(mockUser);

      const result = await controller.remove('1');

      expect(result).toEqual(mockUser);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});