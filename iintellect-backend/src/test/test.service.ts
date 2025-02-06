import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestDto, UpdateTestDto } from '../dto/test.dto';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  // Получение списка всех тестов
  async findAll(categoryId?: number, themeId?: number, subthemeId?: number) {
    // Создаем объект фильтров
    const filters: { categoryId?: number; themeId?: number; subthemeId?: number } = {};
  
    // Добавляем только те параметры, которые были переданы
    if (categoryId !== undefined) filters.categoryId = categoryId;
    if (themeId !== undefined) filters.themeId = themeId;
    if (subthemeId !== undefined) filters.subthemeId = subthemeId;
      const tests = await this.prisma.test.findMany({
        where: filters,
        include: {
          category: true,
          theme: true,
          subtheme: true,
        },
      });
  
      if (!tests || tests.length === 0) {
        throw new NotFoundException('Тесты не найдены');
      }
      return tests;
  }

  // Создание теста
  async create(userId: number, data: CreateTestDto) {
    return this.prisma.test.create({
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        themeId: data.themeId,
        subthemeId: data.subthemeId,
        tags: data.tags,
        user_id: userId,
        questions: data.questions?.length
          ? {
              create: data.questions.map((q) => ({
                title: q.title,
                text: q.text,
                has_variants: q.has_variants,
                variants: q.variants,
                answers: {
                  create: q.answers.map((a) => ({
                    answer: a.answer,
                    comment: a.comment,
                  })),
                },
              })),
            }
          : undefined,
      },
    });
  }



  // Получение теста по ID
  async findOne(id: number) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!test) {
      throw new NotFoundException('Тест не найден');
    }

    return test;
  }

  // Обновление теста
  async update(id: number, userId: number, data: UpdateTestDto) {
    const test = await this.prisma.test.findUnique({ where: { id } });

    if (!test || test.user_id !== userId) {
      throw new ForbiddenException('Вы не можете редактировать этот тест');
    }

    return this.prisma.test.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        themeId: data.themeId,
        subthemeId: data.subthemeId,
        tags: data.tags,
        questions: data.questions?.length
          ? {
              deleteMany: {},
              create: data.questions.map((q) => ({
                title: q.title,
                text: q.text,
                has_variants: q.has_variants,
                variants: q.variants,
                answers: {
                  create: q.answers.map((a) => ({
                    answer: a.answer,
                    comment: a.comment,
                  })),
                },
              })),
            }
          : undefined,
      },
    });
  }

  // Удаление теста
  async remove(id: number, userId: number) {
    const test = await this.prisma.test.findUnique({ where: { id } });

    if (!test || test.user_id !== userId) {
      throw new ForbiddenException('Вы не можете удалить этот тест');
    }

    return this.prisma.test.delete({ where: { id } });
  }
}