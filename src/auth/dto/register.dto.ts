import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, isStrongPassword, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    default: ""
  })
  @IsString()   
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    default: ""
  })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    default: ""
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  @IsStrongPassword()
  password: string; 
}