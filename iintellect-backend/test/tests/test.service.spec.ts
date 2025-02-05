import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { TestService } from '../../src/test/test.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TestService', () => {
  let service: TestService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(), // Используем mockDeep для PrismaService
        },
      ],
    }).compile();

    service = module.get<TestService>(TestService);
    prisma = module.get(PrismaService); // Теперь prisma — это мокированный объект
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new test with questions and answers', async () => {
      const mockCreateResult = {
        id: 1,
        title: 'Тест по математике',
        description: 'Основы алгебры',
        categoryId: 1,
        themeId: 2,
        subthemeId: 3,
        tags: ['математика', 'алгебра'],
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: null,
      };

      // Мокируем метод create
      prisma.test.create.mockResolvedValue(mockCreateResult);

      const userId = 1;
      const createTestDto = {
        title: 'Тест по математике',
        description: 'Основы алгебры',
        categoryId: 1,
        themeId: 2,
        subthemeId: 3,
        tags: ['математика', 'алгебра'],
        questions: [
          {
            title: 'Вопрос 1',
            text: 'Как решить уравнение x + 2 = 5?',
            has_variants: true,
            variants: ['x = 3', 'x = 7'],
            answers: [
              { answer: 'x = 3', comment: 'Правильный ответ' },
              { answer: 'x = 7', comment: 'Неправильный ответ' },
            ],
          },
        ],
      };

      const result = await service.create(userId, createTestDto);

      expect(result).toEqual(mockCreateResult);
      expect(prisma.test.create).toHaveBeenCalledWith({
        data: {
          title: 'Тест по математике',
          description: 'Основы алгебры',
          categoryId: 1,
          themeId: 2,
          subthemeId: 3,
          tags: ['математика', 'алгебра'],
          user_id: 1,
          questions: {
            create: [
              {
                title: 'Вопрос 1',
                text: 'Как решить уравнение x + 2 = 5?',
                has_variants: true,
                variants: ['x = 3', 'x = 7'],
                answers: {
                  create: [
                    { answer: 'x = 3', comment: 'Правильный ответ' },
                    { answer: 'x = 7', comment: 'Неправильный ответ' },
                  ],
                },
              },
            ],
          },
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a test by ID', async () => {
      const mockTest = {
        id: 1,
        title: 'Тест по математике',
        description: 'Основы алгебры',
        categoryId: 1,
        themeId: 2,
        subthemeId: 3,
        tags: ['математика', 'алгебра'],
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: null,
      };
      prisma.test.findUnique.mockResolvedValue(mockTest); // Мокируем метод findUnique

      const result = await service.findOne(1);

      expect(result).toEqual(mockTest);
      expect(prisma.test.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { questions: { include: { answers: true } } },
      });
    });

    it('should throw NotFoundException if test is not found', async () => {
      prisma.test.findUnique.mockResolvedValue(null); // Мокируем null (тест не найден)

      await expect(service.findOne(999)).rejects.toThrowError(
        new NotFoundException('Тест не найден'),
      );
    });
  });

  describe('update', () => {
    it('should update a test with questions and answers', async () => {
      const mockUpdateResult = {
        id: 1,
        title: 'Обновленный тест по математике',
        description: 'Новые основы алгебры',
        categoryId: 1,
        themeId: 2,
        subthemeId: 3,
        tags: ['математика', 'алгебра'],
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: null,
        questions: [],
      };

      const mockTest = {
        id: 1,
        title: 'Тест по математике',
        description: 'Основы алгебры',
        categoryId: 1,
        themeId: 2,
        subthemeId: 3,
        tags: ['математика', 'алгебра'],
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: null,
      };

      prisma.test.findUnique.mockResolvedValue(mockTest);
      prisma.test.update.mockResolvedValue(mockUpdateResult);

      const userId = 1;
      const updateTestDto = {
        title: 'Обновленный тест по математике',
        description: 'Новые основы алгебры',
        categoryId: 1,
        themeId: 2,
        subthemeId: 3,
        tags: ['математика', 'алгебра'],
        questions: [
          {
            id: 1,
            text: 'Как решить уравнение x + 3 = 8?',
            has_variants: true,
            variants: ['x = 5', 'x = 10'],
            answers: [{ id: 1, answer: 'x = 5', comment: 'Правильный ответ' }],
          },
        ],
      };

      const result = await service.update(1, userId, updateTestDto);

      expect(result).toEqual(mockUpdateResult);
      expect(prisma.test.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: 'Обновленный тест по математике',
          description: 'Новые основы алгебры',
          categoryId: 1,
          themeId: 2,
          subthemeId: 3,
          tags: ['математика', 'алгебра'],
          questions: {
            deleteMany: {},
            create: [
              {
                text: 'Как решить уравнение x + 3 = 8?',
                has_variants: true,
                variants: ['x = 5', 'x = 10'],
                answers: {
                  create: [{ answer: 'x = 5', comment: 'Правильный ответ' }],
                },
              },
            ],
          },
        },
      });
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const mockTest = {
        id: 1,
        title: 'Тест по математике',
        description: 'Основы алгебры',
        categoryId: 1,
        themeId: 2,
        subthemeId: 3,
        tags: ['математика', 'алгебра'],
        user_id: 2, // Владелец — другой пользователь
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: null,
      };

      prisma.test.findUnique.mockResolvedValue(mockTest);

      await expect(service.update(1, 1, {})).rejects.toThrowError(
        new ForbiddenException('Вы не можете редактировать этот тест'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a test', async () => {
      const mockTest = {
        id: 1,
        title: 'Тест по математике',
        description: 'Основы алгебры',
        categoryId: 1,
        themeId: 2,
        subthemeId: 3,
        tags: ['математика', 'алгебра'],
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: null,
      };

      const mockDeletedTest = {
        id: 1,
        title: 'Тест по математике',
        description: 'Основы алгебры',
        categoryId: 1,
        themeId: 2,
        subthemeId: 3,
        tags: ['математика', 'алгебра'],
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: null,
      };

      prisma.test.findUnique.mockResolvedValue(mockTest);
      prisma.test.delete.mockResolvedValue(mockDeletedTest);

      const result = await service.remove(1, 1);

      expect(result).toEqual(mockDeletedTest);
      expect(prisma.test.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const mockTest = {
        id: 1,
        title: 'Тест по математике',
        description: 'Основы алгебры',
        categoryId: 1,
        themeId: 2,
        subthemeId: 3,
        tags: ['математика', 'алгебра'],
        user_id: 2, // Владелец — другой пользователь
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: null,
      };

      prisma.test.findUnique.mockResolvedValue(mockTest);

      await expect(service.remove(1, 1)).rejects.toThrowError(
        new ForbiddenException('Вы не можете удалить этот тест'),
      );
    });
  });
});