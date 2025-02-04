import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // Category Routes
  @Post('categories')
  createCategory(@Body() data: any) {
    return this.contentService.createCategory(data);
  }

  @Get('categories')
  findAllCategories() {
    return this.contentService.findAllCategories();
  }

  @Get('categories/:id')
  findOneCategory(@Param('id') id: string) {
    return this.contentService.findOneCategory(+id);
  }

  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateCategory(+id, data);
  }

  @Delete('categories/:id')
  removeCategory(@Param('id') id: string) {
    return this.contentService.removeCategory(+id);
  }

  // Theme Routes
  @Post('themes')
  createTheme(@Body() data: any) {
    return this.contentService.createTheme(data);
  }

  @Get('themes')
  findAllThemes() {
    return this.contentService.findAllThemes();
  }

  @Get('themes/:id')
  findOneTheme(@Param('id') id: string) {
    return this.contentService.findOneTheme(+id);
  }

  @Put('themes/:id')
  updateTheme(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateTheme(+id, data);
  }

  @Delete('themes/:id')
  removeTheme(@Param('id') id: string) {
    return this.contentService.removeTheme(+id);
  }

  // Subtheme Routes
  @Post('subthemes')
  createSubtheme(@Body() data: any) {
    return this.contentService.createSubtheme(data);
  }

  @Get('subthemes')
  findAllSubthemes() {
    return this.contentService.findAllSubthemes();
  }

  @Get('subthemes/:id')
  findOneSubtheme(@Param('id') id: string) {
    return this.contentService.findOneSubtheme(+id);
  }

  @Put('subthemes/:id')
  updateSubtheme(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updateSubtheme(+id, data);
  }

  @Delete('subthemes/:id')
  removeSubtheme(@Param('id') id: string) {
    return this.contentService.removeSubtheme(+id);
  }
}