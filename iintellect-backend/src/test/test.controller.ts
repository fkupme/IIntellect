import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  Req,
  NotFoundException,
  Query
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto, UpdateTestDto } from '../dto/test.dto';
import { PrismaService } from '../prisma/prisma.service';

@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  // Получение всего списка тестов
  @Get()
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('themeId') themeId?: string,
    @Query('subthemeId') subthemeId?: string,
  ) {
    // Преобразуем строки в числа
    const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
    const parsedThemeId = themeId ? parseInt(themeId, 10) : undefined;
    const parsedSubthemeId = subthemeId ? parseInt(subthemeId, 10) : undefined;

    // Вызываем сервис с числовыми значениями
    return this.testService.findAll(parsedCategoryId, parsedThemeId, parsedSubthemeId);
  }


  // Создание теста
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createTestDto: CreateTestDto, @Req() req) {
    const userId = req.user.id; // Предположим, что пользователь аутентифицирован
    return this.testService.create(userId, createTestDto);
  }

  // Получение теста по ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testService.findOne(+id);
  }

  // Обновление теста
  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto, @Req() req) {
    const userId = req.user.id;
    return this.testService.update(+id, userId, updateTestDto);
  }

  // Удаление теста
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.testService.remove(+id, userId);
  }
}