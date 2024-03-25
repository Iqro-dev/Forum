import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ArticlesService } from './articles.service';
import { Article } from './interfaces/article.interface';
import { CreateArticleDto, UpdateArticleDto } from './dtos/create-article.dto';

import { CurrentUser } from 'src/auth/decorators';
import { UserDocument } from 'src/users/schemas/user.schema';
import { LocalAuthGuard } from 'src/auth/guards';

@Controller('articles')
@UseGuards(LocalAuthGuard)
@ApiBearerAuth('bearer')
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
    @CurrentUser() user: UserDocument,
  ) {
    return this.articlesService.createArticle(createArticleDto, user);
  }

  @Put(':id')
  updateArticle(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateArticleDto: UpdateArticleDto,
  ): Promise<Article | null> {
    return this.articlesService.updateArticle(id, updateArticleDto);
  }

  @Delete(':id')
  deleteArticle(@Param('id') id: string): Promise<Article | null> {
    return this.articlesService.deleteArticle(id);
  }
}
