import { IsString, IsOptional } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  answer: string;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdateAnswerDto {
  @IsString()
  @IsOptional()
  answer?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}