import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnswerDto } from '../dto/create-answer.dto';

@Injectable()
export class AnswersService {
  constructor(private readonly prisma: PrismaService) {}

  // Создание ответа
  async create(createAnswerDto: CreateAnswerDto) {
    return this.prisma.answer.create({ data: createAnswerDto });
  }

  // Получение всех ответов
  async findAll() {
    return this.prisma.answer.findMany();
  }

  // Получение ответа по ID
  async findOne(id: number) {
    return this.prisma.answer.findUnique({ where: { id } });
  }

  // Обновление ответа
  async update(id: number, updateAnswerDto: any) {
    return this.prisma.answer.update({ where: { id }, data: updateAnswerDto });
  }

  // Удаление ответа
  async remove(id: number) {
    return this.prisma.answer.delete({ where: { id } });
  }
}