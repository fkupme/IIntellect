// test/test.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TestService } from '../../src/test/test.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateTestDto, UpdateTestDto } from '../../src/dto/test.dto';

describe('TestService', () => {
  let service: TestService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestService,
        {
          provide: PrismaService,
          useValue: {
            test: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TestService>(TestService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return tests with filters', async () => {
      const mockTests = [
        { id: 1, title: 'Математика', categoryId: 1, themeId: 1, subthemeId: 1 },
        { id: 2, title: 'Физика', categoryId: 2, themeId: 2, subthemeId: 2 },
      ];
      jest.spyOn(prisma.test, 'findMany').mockResolvedValue(mockTests);

      const result = await service.findAll(1, 1, 1);
      expect(result).toEqual(mockTests);
      expect(prisma.test.findMany).toHaveBeenCalledWith({
        where: { categoryId: 1, themeId: 1, subthemeId: 1 },
        include: { category: true, theme: true, subtheme: true },
      });
    });

    it('should throw an error if no tests are found', async () => {
      jest.spyOn(prisma.test, 'findMany').mockResolvedValue([]);

      await expect(service.findAll(999)).rejects.toThrow(
        new NotFoundException('Тесты не найдены'),
      );
    });
  });

  describe('create', () => {
    it('should create a test', async () => {
      const mockTest = { id: 1, title: 'Математика', user_id: 1 };
      jest.spyOn(prisma.test, 'create').mockResolvedValue(mockTest);

      const createTestDto: CreateTestDto = {
        title: 'Математика',
        description: 'Тест по математике',
        categoryId: 1,
        themeId: 1,
        subthemeId: 1,
        tags: ['математика'],
      };

      const result = await service.create(1, createTestDto);
      expect(result).toEqual(mockTest);
      expect(prisma.test.create).toHaveBeenCalledWith({
        data: {
          title: 'Математика',
          description: 'Тест по математике',
          categoryId: 1,
          themeId: 1,
          subthemeId: 1,
          tags: ['математика'],
          user_id: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a test by ID', async () => {
      const mockTest = { id: 1, title: 'Математика', user_id: 1 };
      jest.spyOn(prisma.test, 'findUnique').mockResolvedValue(mockTest);

      const result = await service.findOne(1);
      expect(result).toEqual(mockTest);
      expect(prisma.test.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { questions: { include: { answers: true } } },
      });
    });

    it('should throw an error if test is not found', async () => {
      jest.spyOn(prisma.test, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Тест не найден'),
      );
    });
  });

  describe('update', () => {
    it('should update a test', async () => {
      const mockTest = { id: 1, title: 'Математика', user_id: 1 };
      jest.spyOn(prisma.test, 'findUnique').mockResolvedValue(mockTest);
      jest.spyOn(prisma.test, 'update').mockResolvedValue(mockTest);

      const updateTestDto: UpdateTestDto = { title: 'Обновленный тест' };
      const result = await service.update(1, 1, updateTestDto);
      expect(result).toEqual(mockTest);
      expect(prisma.test.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'Обновленный тест' },
      });
    });

    it('should throw an error if user is not the owner', async () => {
      jest.spyOn(prisma.test, 'findUnique').mockResolvedValue({ id: 1, user_id: 2 });

      await expect(service.update(1, 1, {})).rejects.toThrow(
        new ForbiddenException('Вы не можете редактировать этот тест'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a test', async () => {
      const mockTest = { id: 1, title: 'Математика', user_id: 1 };
      jest.spyOn(prisma.test, 'findUnique').mockResolvedValue(mockTest);
      jest.spyOn(prisma.test, 'delete').mockResolvedValue(mockTest);

      const result = await service.remove(1, 1);
      expect(result).toEqual(mockTest);
      expect(prisma.test.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if user is not the owner', async () => {
      jest.spyOn(prisma.test, 'findUnique').mockResolvedValue({ id: 1, user_id: 2 });

      await expect(service.remove(1, 1)).rejects.toThrow(
        new ForbiddenException('Вы не можете удалить этот тест'),
      );
    });
  });
});