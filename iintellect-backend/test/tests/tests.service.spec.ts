import { Test, TestingModule } from '@nestjs/testing';
import { TestsService } from '../../src/tests/tests.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateTestDto } from '../../src/dto/create-test.dto';
import { UpdateTestDto } from '../../src/dto/update-test.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('TestsService', () => {
  let service: TestsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestsService,
        {
          provide: PrismaService,
          useValue: {
            test: {
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

    service = module.get<TestsService>(TestsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      const userId = 1;

      const mockTest = { id: 1, ...createTestDto };
      (prismaService.test.create as jest.Mock).mockResolvedValue(mockTest);

      const result = await service.create(userId, createTestDto);
      expect(result).toEqual(mockTest);
      expect(prismaService.test.create).toHaveBeenCalledWith({
        data: {
          title: createTestDto.title,
          description: createTestDto.description,
          tags: { set: createTestDto.tags },
          user: { connect: { id: userId } },
          category: { connect: { id: createTestDto.categoryId } },
          theme: { connect: { id: createTestDto.themeId } },
          subtheme: { connect: { id: createTestDto.subthemeId } },
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of tests', async () => {
      const mockTests = [{ id: 1, title: 'Test 1' }, { id: 2, title: 'Test 2' }];
      (prismaService.test.findMany as jest.Mock).mockResolvedValue(mockTests);

      const result = await service.findAll();
      expect(result).toEqual(mockTests);
      expect(prismaService.test.findMany).toHaveBeenCalledWith({
        include: { user: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a test by id', async () => {
      const testId = 1;
      const mockTest = { id: testId, title: 'Test 1' };
      (prismaService.test.findUnique as jest.Mock).mockResolvedValue(mockTest);

      const result = await service.findOne(testId);
      expect(result).toEqual(mockTest);
      expect(prismaService.test.findUnique).toHaveBeenCalledWith({
        where: { id: testId },
        include: { user: true },
      });
    });

    it('should throw an error if test is not found', async () => {
      const testId = 1;
      (prismaService.test.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(testId)).rejects.toThrow(
        new HttpException('Тест не найден', HttpStatus.NOT_FOUND),
      );
      expect(prismaService.test.findUnique).toHaveBeenCalledWith({
        where: { id: testId },
        include: { user: true },
      });
    });
  });

  describe('update', () => {
    it('should update a test', async () => {
      const testId = 1;
      const updateTestDto: UpdateTestDto = { title: 'Updated Title' };
      const mockTest = { id: testId, title: 'Updated Title' };
      (prismaService.test.findUnique as jest.Mock).mockResolvedValue(mockTest);
      (prismaService.test.update as jest.Mock).mockResolvedValue(mockTest);

      const result = await service.update(testId, updateTestDto);
      expect(result).toEqual(mockTest);
      expect(prismaService.test.update).toHaveBeenCalledWith({
        where: { id: testId },
        data: updateTestDto,
      });
    });

    it('should throw an error if test is not found', async () => {
      const testId = 1;
      const updateTestDto: UpdateTestDto = { title: 'Updated Title' };
      (prismaService.test.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(testId, updateTestDto)).rejects.toThrow(
        new HttpException('Тест не найден', HttpStatus.NOT_FOUND),
      );
      expect(prismaService.test.findUnique).toHaveBeenCalledWith({
        where: { id: testId },
      });
    });
  });

  describe('remove', () => {
    it('should remove a test', async () => {
      const testId = 1;
      const mockTest = { id: testId, title: 'Test 1' };
      (prismaService.test.findUnique as jest.Mock).mockResolvedValue(mockTest);
      (prismaService.test.delete as jest.Mock).mockResolvedValue(mockTest);

      const result = await service.remove(testId);
      expect(result).toEqual(mockTest);
      expect(prismaService.test.delete).toHaveBeenCalledWith({
        where: { id: testId },
      });
    });

    it('should throw an error if test is not found', async () => {
      const testId = 1;
      (prismaService.test.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(testId)).rejects.toThrow(
        new HttpException('Тест не найден', HttpStatus.NOT_FOUND),
      );
      expect(prismaService.test.findUnique).toHaveBeenCalledWith({
        where: { id: testId },
      });
    });
  });
});