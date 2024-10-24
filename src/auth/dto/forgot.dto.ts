import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    default: ""
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
 
}