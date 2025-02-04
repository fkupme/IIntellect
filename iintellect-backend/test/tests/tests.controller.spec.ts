import { Test, TestingModule } from '@nestjs/testing';
import { TestsController } from '../../src/tests/tests.controller';
import { TestsService } from '../../src/tests/tests.service';
import { CreateTestDto } from '../../src/dto/create-test.dto';
import { UpdateTestDto } from '../../src/dto/update-test.dto';
import { AuthGuard } from '@nestjs/passport';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

describe('TestsController', () => {
  let controller: TestsController;
  let testsService: TestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestsController],
      providers: [
        {
          provide: TestsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AuthGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET || '123',
          signOptions: { expiresIn: '60m' },
        }),
      ],
    }).compile();

    controller = module.get<TestsController>(TestsController);
    testsService = module.get<TestsService>(TestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a test', async () => {
      const createTestDto: CreateTestDto = {
        title: 'Test Title',
        description: 'Test Description',
        tags: ['tag1', 'tag2'],
        categoryId: 1,
        themeId: 1,
        subthemeId: 1,
      };
      const user: User = { id: 1, username: 'testuser' } as User;
      const mockTest = { id: 1, ...createTestDto };
      (testsService.create as jest.Mock).mockResolvedValue(mockTest);

      const result = await controller.create(user, createTestDto);
      expect(result).toEqual(mockTest);
      expect(testsService.create).toHaveBeenCalledWith(user.id, createTestDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of tests', async () => {
      const mockTests = [{ id: 1, title: 'Test 1' }, { id: 2, title: 'Test 2' }];
      (testsService.findAll as jest.Mock).mockResolvedValue(mockTests);

      const result = await controller.findAll();
      expect(result).toEqual(mockTests);
      expect(testsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a test by id', async () => {
      const testId = '1';
      const mockTest = { id: 1, title: 'Test 1' };
      (testsService.findOne as jest.Mock).mockResolvedValue(mockTest);

      const result = await controller.findOne(testId);
      expect(result).toEqual(mockTest);
      expect(testsService.findOne).toHaveBeenCalledWith(+testId);
    });

    it('should throw an error if test is not found', async () => {
      const testId = '1';
      (testsService.findOne as jest.Mock).mockRejectedValue(
        new HttpException('Тест не найден', HttpStatus.NOT_FOUND),
      );

      await expect(controller.findOne(testId)).rejects.toThrow(
        new HttpException('Тест не найден', HttpStatus.NOT_FOUND),
      );
      expect(testsService.findOne).toHaveBeenCalledWith(+testId);
    });
  });

  describe('update', () => {
    it('should update a test', async () => {
      const testId = '1';
      const updateTestDto: UpdateTestDto = { title: 'Updated Title' };
      const mockTest = { id: 1, title: 'Updated Title' };
      (testsService.update as jest.Mock).mockResolvedValue(mockTest);

      const result = await controller.update(testId, updateTestDto);
      expect(result).toEqual(mockTest);
      expect(testsService.update).toHaveBeenCalledWith(+testId, updateTestDto);
    });

    it('should throw an error if test is not found', async () => {
      const testId = '1';
      const updateTestDto: UpdateTestDto = { title: 'Updated Title' };
      (testsService.update as jest.Mock).mockRejectedValue(
        new HttpException('Тест не найден', HttpStatus.NOT_FOUND),
      );

      await expect(controller.update(testId, updateTestDto)).rejects.toThrow(
        new HttpException('Тест не найден', HttpStatus.NOT_FOUND),
      );
      expect(testsService.update).toHaveBeenCalledWith(+testId, updateTestDto);
    });
  });

  describe('remove', () => {
    it('should remove a test', async () => {
      const testId = '1';
      const mockTest = { id: 1, title: 'Test 1' };
      (testsService.remove as jest.Mock).mockResolvedValue(mockTest);

      const result = await controller.remove(testId);
      expect(result).toEqual(mockTest);
      expect(testsService.remove).toHaveBeenCalledWith(+testId);
    });

    it('should throw an error if test is not found', async () => {
      const testId = '1';
      (testsService.remove as jest.Mock).mockRejectedValue(
        new HttpException('Тест не найден', HttpStatus.NOT_FOUND),
      );

      await expect(controller.remove(testId)).rejects.toThrow(
        new HttpException('Тест не найден', HttpStatus.NOT_FOUND),
      );
      expect(testsService.remove).toHaveBeenCalledWith(+testId);
    });
  });
});