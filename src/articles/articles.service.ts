import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from './schemas/article.schema';
import { Model } from 'mongoose';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel('Article') private readonly articleModel: Model<Article>,
  ) {}

  async getArticles(): Promise<Article[]> {
    return await this.articleModel.find();
  }

  async getArticle(id: string): Promise<Article> {
    return await this.articleModel.findOne({ _id: id });
  }

  async createArticle(article: Article): Promise<Article> {
    const newArticle = new this.articleModel(article);
    return await newArticle.save();
  }

  async updateArticle(id: string, article: Article): Promise<Article> {
    return await this.articleModel.findByIdAndUpdate(id, article, {
      new: true,
    });
  }

  async deleteArticle(id: string): Promise<Article> {
    return await this.articleModel.findByIdAndRemove(id);
  }
}
