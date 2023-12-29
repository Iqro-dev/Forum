import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Article } from './schemas/article.schema';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel('Article') private readonly articleModel: Model<Article>,
  ) {}

  async getArticles(): Promise<Article[]> {
    return await this.articleModel.find();
  }

  async getArticle(id: string): Promise<Article | null> {
    return await this.articleModel.findOne({ _id: id });
  }

  async createArticle(article: Article): Promise<Article> {
    return await this.articleModel.create(article);
  }

  async updateArticle(id: string, article: Article): Promise<Article | null> {
    return await this.articleModel.findByIdAndUpdate(id, article, {
      new: true,
    });
  }

  async deleteArticle(id: string): Promise<Article | null> {
    return await this.articleModel.findByIdAndRemove(id);
  }
}
