import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from '../dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  // Создание вопроса
  async create(createQuestionDto: CreateQuestionDto) {
    return this.prisma.question.create({ data: createQuestionDto });
  }

  // Получение всех вопросов
  async findAll() {
    return this.prisma.question.findMany();
  }

  // Получение вопроса по ID
  async findOne(id: number) {
    return this.prisma.question.findUnique({ where: { id } });
  }

  // Обновление вопроса
  async update(id: number, updateQuestionDto: any) {
    return this.prisma.question.update({ where: { id }, data: updateQuestionDto });
  }

  // Удаление вопроса
  async remove(id: number) {
    return this.prisma.question.delete({ where: { id } });
  }
}