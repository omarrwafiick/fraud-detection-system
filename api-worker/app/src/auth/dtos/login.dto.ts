import { IsEmail, IsString, MinLength } from 'class-validator';
import { User } from '../entities/user.entity';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class BaseUserResponseDto {
  data: Partial<User>;
  access_token?: string;
}