import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnswerDto } from '../dto/create-answer.dto';

@Injectable()
export class AnswersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAnswerDto: CreateAnswerDto) {
    return this.prisma.answer.create({ data: createAnswerDto });
  }

  async findAll() {
    return this.prisma.answer.findMany();
  }

  async findOne(id: number) {
    return this.prisma.answer.findUnique({ where: { id } });
  }

  async update(id: number, updateAnswerDto: any) {
    return this.prisma.answer.update({ where: { id }, data: updateAnswerDto });
  }

  async remove(id: number) {
    return this.prisma.answer.delete({ where: { id } });
  }
}