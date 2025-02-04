import { IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserAnswerDto {
  @IsNumber()
  user_test_id: number;

  @IsNumber()
  question_id: number;

  @IsString()
  answer: string;

  @IsBoolean()
  is_correct: boolean;

  @IsOptional()
  answered_at?: Date;

  @IsOptional()
  @IsNumber()
  answer_id?: number;
}