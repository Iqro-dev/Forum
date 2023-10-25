import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { Model } from 'mongoose';
import { Article } from './interfaces/article.interface';
import { getModelToken } from '@nestjs/mongoose';
import { createMock } from '@golevelup/ts-jest';

describe('ArticlesService', () => {
  let articlesService: ArticlesService;
  let articlesModel: Model<Article>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getModelToken('Article'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    articlesService = module.get<ArticlesService>(ArticlesService);
    articlesModel = module.get<Model<Article>>(getModelToken('Article'));
  });

  it('should be defined', () => {
    expect(articlesService).toBeDefined();
  });

  describe('getArticles', () => {
    it('should return all articles', async () => {
      const result = createMock<Article[]>();

      jest.spyOn(articlesModel, 'find').mockResolvedValue(result);

      expect(await articlesService.getArticles()).toBe(result);
    });
  });

  describe('getArticle', () => {
    it('should return a single article', async () => {
      const result = createMock<Article>();

      jest.spyOn(articlesModel, 'findOne').mockResolvedValue(result);

      expect(await articlesService.getArticle('1')).toBe(result);
    });
  });

  describe('createArticle', () => {
    it('should create an article', async () => {
      const result = createMock<Article>();

      jest.spyOn(articlesModel, 'create').mockResolvedValue(result as any);

      expect(await articlesService.createArticle(result)).toBe(result);
    });
  });

  describe('updateArticle', () => {
    it('should update an article', async () => {
      const result = createMock<Article>();

      jest.spyOn(articlesModel, 'findByIdAndUpdate').mockResolvedValue(result);

      expect(await articlesService.updateArticle('1', result)).toBe(result);
    });
  });

  describe('deleteArticle', () => {
    it('should delete an article', async () => {
      const result = createMock<Article>();

      jest.spyOn(articlesModel, 'findByIdAndRemove').mockResolvedValue(result);

      expect(await articlesService.deleteArticle('1')).toBe(result);
    });
  });
});
