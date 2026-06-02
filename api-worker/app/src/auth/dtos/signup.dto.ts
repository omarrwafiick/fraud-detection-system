import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpUserDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  webhookUrl: string;

  @IsString()
  tenantName: string
}