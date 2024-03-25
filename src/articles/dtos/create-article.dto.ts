import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  readonly title: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  readonly content: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  readonly authorID: string;

  @ApiProperty()
  @IsString({ each: true })
  readonly likes: string[];

  @ApiProperty()
  @IsString({ each: true })
  readonly dislikes: string[];

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value + ''))
  readonly date: Date;
}
