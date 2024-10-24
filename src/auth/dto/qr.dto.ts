import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class QrDto {
  @ApiProperty({
    default: ""
  })
  @IsString()   
  @IsNotEmpty()
  @IsEmail()
  email: string; 
}