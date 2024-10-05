import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  @MinLength(10)
  readonly content: string;
}

export class UpdateArticleDto extends CreateArticleDto {
  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  readonly likes?: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  readonly dislikes?: string[];
}
