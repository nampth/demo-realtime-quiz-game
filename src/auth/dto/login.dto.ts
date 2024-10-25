import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
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
  password: string;
}