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
import { CreateArticleDto, UpdateArticleDto } from './dtos/create-article.dto';

import { CurrentUser } from 'src/auth/decorators';
import { JwtAuthGuard } from 'src/auth/guards';
import { User } from 'src/users/interfaces/user.interface';

@Controller('articles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  getArticles() {
    return this.articlesService.getArticles();
  }

  @Get(':id')
  getArticle(@Param('id') id: string) {
    return this.articlesService.getArticle(id);
  }

  @Post()
  @ApiBearerAuth()
  createArticle(
    @Body(new ValidationPipe()) createArticleDto: CreateArticleDto,
    @CurrentUser() user: User,
  ) {
    return this.articlesService.createArticle(createArticleDto, user);
  }

  @Put(':id')
  updateArticle(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.updateArticle(id, updateArticleDto);
  }

  @Delete(':id')
  deleteArticle(@Param('id') id: string) {
    return this.articlesService.deleteArticle(id);
  }
}
