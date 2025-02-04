import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsNumber()
  questionId: number; // Add this line to include the question field
}