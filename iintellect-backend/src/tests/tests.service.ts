import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestDto } from '../dto/create-test.dto';
import { UpdateTestDto } from '../dto/update-test.dto';

@Injectable()
export class TestsService {
  constructor(private readonly prisma: PrismaService) {}

  // Создание теста
  async create(userId: number, createTestDto: CreateTestDto) {
    return this.prisma.test.create({
      data: {
        title: createTestDto.title,
        description: createTestDto.description,
        tags: { set: createTestDto.tags || [] },
        user: { connect: { id: userId } },
        category: createTestDto.categoryId
          ? { connect: { id: createTestDto.categoryId } }
          : undefined,
        theme: createTestDto.themeId
          ? { connect: { id: createTestDto.themeId } }
          : undefined,
        subtheme: createTestDto.subthemeId
          ? { connect: { id: createTestDto.subthemeId } }
          : undefined,
      },
    });
  }

  // Получение всех тестов
  async findAll() {
    return this.prisma.test.findMany({
      include: {
        user: true, // Включаем данные пользователя
      },
    });
  }

  // Получение теста по ID
  async findOne(id: number) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!test) {
      throw new HttpException('Тест не найден', HttpStatus.NOT_FOUND);
    }

    return test;
  }

  // Обновление теста
  async update(id: number, updateTestDto: UpdateTestDto) {
    const test = await this.prisma.test.findUnique({ where: { id } });

    if (!test) {
      throw new HttpException('Тест не найден', HttpStatus.NOT_FOUND);
    }

    return this.prisma.test.update({
      where: { id },
      data: updateTestDto,
    });
  }

  // Удаление теста
  async remove(id: number) {
    const test = await this.prisma.test.findUnique({ where: { id } });

    if (!test) {
      throw new HttpException('Тест не найден', HttpStatus.NOT_FOUND);
    }

    return this.prisma.test.delete({ where: { id } });
  }
}