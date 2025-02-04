import { IsNumber, IsOptional } from 'class-validator';

export class CreateUserTestDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  test_id: number;

  @IsOptional()
  started_at?: Date;

  @IsOptional()
  completed_at?: Date;

  @IsOptional()
  score?: number;
}