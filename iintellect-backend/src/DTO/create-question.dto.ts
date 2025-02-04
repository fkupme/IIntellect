import { IsString, IsBoolean, IsOptional, IsArray, ArrayMinSize, IsNumber } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsNumber()
  testId: number; // ID теста

  @IsBoolean()
  has_variants?: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  variants?: string[]; // Массив вариантов ответов
}