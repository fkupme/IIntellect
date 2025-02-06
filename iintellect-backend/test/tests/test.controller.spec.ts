import { Test, TestingModule } from '@nestjs/testing';
import { TestController } from '../../src/test/test.controller';
import { TestService } from '../../src/test/test.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateTestDto, UpdateTestDto } from '../../src/dto/test.dto';
import { group } from 'console';
import { mockTest, mockTests, mockTestWithQuestions } from './mocks';

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
            findAll: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
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

  describe('findAll', () => {
    it('should return tests with filters', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(mockTests);

      const result = await controller.findAll('1', '2', '3');
      expect(result).toEqual(mockTests);
      expect(service.findAll).toHaveBeenCalledWith(1, 2, 3);
    });

    it('should return all tests if no filters are provided', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(mockTests);

      const result = await controller.findAll();
      expect(result).toEqual(mockTests);
      expect(service.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
      );
    });
  });

  describe('create', () => {
    it('should create a test', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockTest);

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
      const req = { user: { id: 1 } };

      const result = await controller.create(createTestDto, req);
      expect(result).toEqual(mockTest);
      expect(service.create).toHaveBeenCalledWith(1, createTestDto);
    });
  });

  describe('findOne', () => {
    it('should return a test by ID', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTestWithQuestions);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockTestWithQuestions);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an error if test is not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Тест не найден'));

      await expect(controller.findOne('999')).rejects.toThrow(
        new NotFoundException('Тест не найден'),
      );
    });
  });

  describe('update', () => {
    it('should update a test', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(mockTest);

      const updateTestDto = {
        title: 'Обновленный тест',
        description: 'Обновленное описание',
      };
      const req = { user: { id: 1 } };

      const result = await controller.update('1', updateTestDto, req);
      expect(result).toEqual(mockTest);
      expect(service.update).toHaveBeenCalledWith(1, 1, updateTestDto);
    });

    it('should throw an error if user is not the owner', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new ForbiddenException('Вы не можете редактировать этот тест'),
        );

      const updateTestDto = { title: 'Обновленный тест' };
      const req = { user: { id: 2 } };

      await expect(controller.update('1', updateTestDto, req)).rejects.toThrow(
        new ForbiddenException('Вы не можете редактировать этот тест'),
      );
    });
  });

  describe('remove', () => {
    it('should remove a test', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockTest);

      const req = { user: { id: 1 } };

      const result = await controller.remove('1', req);
      expect(result).toEqual(mockTest);
      expect(service.remove).toHaveBeenCalledWith(1, 1);
    });

    it('should throw an error if user is not the owner', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(
          new ForbiddenException('Вы не можете удалить этот тест'),
        );

      const req = { user: { id: 2 } };

      await expect(controller.remove('1', req)).rejects.toThrow(
        new ForbiddenException('Вы не можете удалить этот тест'),
      );
    });
  });
});
