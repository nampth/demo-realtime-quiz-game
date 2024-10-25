import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateGameDto {
    @ApiProperty({
        default: ""
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        default: ""
    })
    @IsString()
    @IsNotEmpty()
    description: string; 
    
    @ApiProperty({
        default: ""
    })
    @IsString()
    @IsNotEmpty()
    created_by: string;
}