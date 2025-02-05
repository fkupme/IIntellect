import { IsString, IsEmail, MinLength, IsOptional} from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  second_name: string;

  @IsString()
  phone: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  second_name?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}