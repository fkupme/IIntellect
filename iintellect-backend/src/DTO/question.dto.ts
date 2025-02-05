import { IsString, IsBoolean, IsArray, ValidateNested, IsOptional, IsNumber, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAnswerDto, UpdateAnswerDto } from './answer.dto';

export class CreateQuestionDto {
  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsBoolean()
  @IsOptional()
  has_variants?: boolean;

  @IsArray()
  @IsOptional()
  variants?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}

export class UpdateQuestionDto {
  @IsNumber()
  id?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsBoolean()
  @IsOptional()
  has_variants?: boolean;

  @IsArray()
  @IsOptional()
  variants?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAnswerDto)
  answers?: UpdateAnswerDto[];
}