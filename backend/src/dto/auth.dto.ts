
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../auth/password-policy';

export class LoginDto {
  @ApiProperty({ description: 'Username for login', example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @ApiProperty({ description: 'Password for login', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: 'New password', minLength: MIN_PASSWORD_LENGTH, maxLength: MAX_PASSWORD_LENGTH })
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH, { message: `A nova senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres` })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: `A nova senha pode ter no máximo ${MAX_PASSWORD_LENGTH} caracteres` })
  newPassword: string;
}
