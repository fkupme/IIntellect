import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateTestDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  categoryId?: number;

  @IsOptional()
  themeId?: number;

  @IsOptional()
  subthemeId?: number;

  @IsArray()
  @IsOptional()
  tags?: string[];
}