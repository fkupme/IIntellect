import { Test, TestingModule } from '@nestjs/testing';
import { TestController } from '../../src/test/test.controller';
import { TestService } from '../../src/test/test.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TestController', () => {
  let controller: TestController;
  let service: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      providers: [
        {
          provide: TestService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TestController>(TestController);
    service = module.get<TestService>(TestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new test', async () => {
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
        questions: [],
      };

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

      jest.spyOn(service, 'create').mockResolvedValue(mockCreateResult);

      const result = await controller.create(createTestDto, {
        user: { id: userId },
      });

      expect(result).toEqual(mockCreateResult);
      expect(service.create).toHaveBeenCalledWith(userId, createTestDto);
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
        questions: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTest);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockTest);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if test is not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Тест не найден'));

      await expect(controller.findOne('999')).rejects.toThrowError(
        new NotFoundException('Тест не найден'),
      );
    });
  });

  describe('findAll', () => {
    it('should return all tests with filters', async () => {
      const mockTests = [
        {
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
          category: {
            id: 1,
            name: 'Математика',
            description: 'Категория для тестов по математике',
          },
          theme: {
            id: 2,
            name: 'Алгебра',
            description: 'Тема по алгебре',
            categoryId: 1,
          },
          subtheme: {
            id: 3,
            name: 'Линейные уравнения',
            themeId: 2,
          },
        },
        {
          id: 2,
          title: 'Тест по истории',
          description: 'История России',
          categoryId: 4,
          themeId: 5,
          subthemeId: 6,
          tags: ['история', 'Россия'],
          user_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          groupId: null,
          category: {
            id: 4,
            name: 'История',
            description: 'Категория для тестов по истории',
          },
          theme: {
            id: 5,
            name: 'История России',
            description: 'Тема по истории России',
            categoryId: 4,
          },
          subtheme: {
            id: 6,
            name: 'Средневековая Россия',
            themeId: 5,
          },
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockTests);

      const result = await controller.findAll(
        '1',
        '2',
        '3',
      );

      expect(result).toEqual(mockTests);
      expect(service.findAll).toHaveBeenCalledWith(1, 2, 3); // Ожидаем числа
    });
  });

  describe('update', () => {
    it('should update a test', async () => {
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

      jest.spyOn(service, 'update').mockResolvedValue(mockUpdateResult);

      const result = await controller.update('1', updateTestDto, {
        user: { id: userId },
      });

      expect(result).toEqual(mockUpdateResult);
      expect(service.update).toHaveBeenCalledWith(1, userId, updateTestDto);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new ForbiddenException('Вы не можете редактировать этот тест'),
        );

      await expect(
        controller.update('1', {}, { user: { id: 1 } }),
      ).rejects.toThrowError(
        new ForbiddenException('Вы не можете редактировать этот тест'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a test', async () => {
      const mockDeleteResult = {
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
        questions: [],
      };

      jest.spyOn(service, 'remove').mockResolvedValue(mockDeleteResult);

      const result = await controller.remove('1', { user: { id: 1 } });

      expect(result).toEqual(mockDeleteResult);
      expect(service.remove).toHaveBeenCalledWith(1, 1);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(
          new ForbiddenException('Вы не можете удалить этот тест'),
        );

      await expect(
        controller.remove('1', { user: { id: 1 } }),
      ).rejects.toThrowError(
        new ForbiddenException('Вы не можете удалить этот тест'),
      );
    });
  });
});
