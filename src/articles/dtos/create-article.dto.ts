import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly content: string;

  @ApiProperty()
  readonly authorID: string;

  @ApiProperty()
  readonly likes: string[];

  @ApiProperty()
  readonly dislikes: string[];

  @ApiProperty()
  readonly date: Date;
}
