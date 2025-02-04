import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from '../dto/create-test.dto';
import { UpdateTestDto } from '../dto/update-test.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from 'prisma/prisma-client'


@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(@GetUser() user: User, @Body() createTestDto: CreateTestDto) {
    return this.testsService.create(user.id, createTestDto);
  }

  @Get()
  async findAll() {
    return this.testsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.testsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testsService.update(+id, updateTestDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async remove(@Param('id') id: string) {
    return this.testsService.remove(+id);
  }
}