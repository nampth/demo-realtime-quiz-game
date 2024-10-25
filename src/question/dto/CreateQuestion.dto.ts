import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateQuestionDto {
    @ApiProperty({
        default: ""
    })
    @IsString()
    @IsNotEmpty()
    question: string;

    @ApiProperty({
        default: ""
    })
    @IsString()
    @IsNotEmpty()
    options: string;

    @ApiProperty({
        default: ""
    })
    @IsString()
    @IsNotEmpty()
    answer: number;

    @ApiProperty({
        default: ""
    })
    @IsString()
    @IsNotEmpty()
    game_id: string;

    @ApiProperty({
        default: 0
    })
    @IsNumber()
    @IsNotEmpty()
    score: number;

    @ApiProperty({
        default: 0
    })
    @IsNumber()
    @IsNotEmpty()
    duration: number;

    @ApiProperty({
        default: 0
    })
    @IsNumber()
    @IsNotEmpty()
    order: number;


}