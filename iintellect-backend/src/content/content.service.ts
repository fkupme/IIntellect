import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  // Category CRUD
  async createCategory(data: any) {
    return this.prisma.category.create({ data });
  }

  async findAllCategories() {
    return this.prisma.category.findMany();
  }

  async findOneCategory(id: number) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async updateCategory(id: number, data: any) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async removeCategory(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }

  // Theme CRUD
  async createTheme(data: any) {
    return this.prisma.theme.create({ data });
  }

  async findAllThemes() {
    return this.prisma.theme.findMany();
  }

  async findOneTheme(id: number) {
    return this.prisma.theme.findUnique({ where: { id } });
  }

  async updateTheme(id: number, data: any) {
    return this.prisma.theme.update({ where: { id }, data });
  }

  async removeTheme(id: number) {
    return this.prisma.theme.delete({ where: { id } });
  }

  // Subtheme CRUD
  async createSubtheme(data: any) {
    return this.prisma.subtheme.create({ data });
  }

  async findAllSubthemes() {
    return this.prisma.subtheme.findMany();
  }

  async findOneSubtheme(id: number) {
    return this.prisma.subtheme.findUnique({ where: { id } });
  }

  async updateSubtheme(id: number, data: any) {
    return this.prisma.subtheme.update({ where: { id }, data });
  }

  async removeSubtheme(id: number) {
    return this.prisma.subtheme.delete({ where: { id } });
  }
}