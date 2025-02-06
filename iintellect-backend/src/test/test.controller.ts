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
  Query
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto, UpdateTestDto } from '../dto/test.dto';

@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  async findAll(
    @Query('categoryId') categoryId?: string,
    @Query('themeId') themeId?: string,
    @Query('subthemeId') subthemeId?: string,
  ) {
    const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
    const parsedThemeId = themeId ? parseInt(themeId, 10) : undefined;
    const parsedSubthemeId = subthemeId ? parseInt(subthemeId, 10) : undefined;

    return this.testService.findAll(parsedCategoryId, parsedThemeId, parsedSubthemeId);
  }



  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createTestDto: CreateTestDto, @Req() req) {
    const userId = req.user.id;
    return this.testService.create(userId, createTestDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testService.findOne(+id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto, @Req() req) {
    const userId = req.user.id;
    return this.testService.update(+id, userId, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.testService.remove(+id, userId);
  }
}