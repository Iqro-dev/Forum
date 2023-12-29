import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';

import { ArticlesService } from './articles.service';
import { Article } from './interfaces/article.interface';
import { CreateArticleDto } from './dtos/create-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  getArticles(): Promise<Article[]> {
    return this.articlesService.getArticles();
  }

  @Get(':id')
  getArticle(@Param('id') id: string): Promise<Article | null> {
    return this.articlesService.getArticle(id);
  }

  @Post()
  createArticle(
    @Body(new ValidationPipe()) createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articlesService.createArticle(createArticleDto);
  }

  @Put(':id')
  updateArticle(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateArticleDto: CreateArticleDto,
  ): Promise<Article | null> {
    return this.articlesService.updateArticle(id, updateArticleDto);
  }

  @Delete(':id')
  deleteArticle(@Param('id') id: string): Promise<Article | null> {
    return this.articlesService.deleteArticle(id);
  }
}
