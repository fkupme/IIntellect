import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTestDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  themeId?: number;

  @IsNumber()
  @IsOptional()
  subthemeId?: number;

  @IsString({ each: true })
  @IsOptional()
  tags: string[];
}