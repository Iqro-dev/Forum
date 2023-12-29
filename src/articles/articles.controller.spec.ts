import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './schemas/article.schema';
import { CreateArticleDto } from './dtos/create-article.dto';

describe('ArticlesController', () => {
  let articlesController: ArticlesController;
  let articlesService: ArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: {
            getArticles: jest.fn(),
            getArticle: jest.fn(),
            createArticle: jest.fn(),
            updateArticle: jest.fn(),
            deleteArticle: jest.fn(),
          },
        },
      ],
    }).compile();

    articlesController = module.get<ArticlesController>(ArticlesController);
    articlesService = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(articlesController).toBeDefined();
  });

  describe('getArticles', () => {
    it('should return all articles', async () => {
      const result = createMock<Article[]>();

      jest.spyOn(articlesService, 'getArticles').mockResolvedValue(result);

      expect(await articlesController.getArticles()).toBe(result);
    });
  });

  describe('getArticle', () => {
    it('should return article with given id', async () => {
      const result = createMock<Article>();

      const id = '2';

      const getArticleSpy = jest
        .spyOn(articlesService, 'getArticle')
        .mockResolvedValue(result);

      expect(await articlesController.getArticle(id)).toBe(result);

      expect(getArticleSpy).toHaveBeenCalledWith(id);
    });
  });

  describe('createArticle', () => {
    it('should create article with given data', async () => {
      const result = createMock<Article>();

      const createArticleDto = createMock<CreateArticleDto>();

      const createArticleSpy = jest
        .spyOn(articlesService, 'createArticle')
        .mockResolvedValue(result);

      expect(await articlesController.createArticle(createArticleDto)).toBe(
        result,
      );

      expect(createArticleSpy).toHaveBeenCalledWith(createArticleDto);
    });
  });

  describe('updateArticle', () => {
    it('should update article with given data', async () => {
      const result = createMock<Article>();

      const updateArticleDto = createMock<CreateArticleDto>();

      const id = '2';

      const updateArticleSpy = jest
        .spyOn(articlesService, 'updateArticle')
        .mockResolvedValue(result);

      expect(await articlesController.updateArticle(id, updateArticleDto)).toBe(
        result,
      );

      expect(updateArticleSpy).toHaveBeenCalledWith(id, updateArticleDto);
    });
  });

  describe('deleteArticle', () => {
    it('should delete article with given id', async () => {
      const result = createMock<Article>();

      const id = '2';

      const deleteArticleSpy = jest
        .spyOn(articlesService, 'deleteArticle')
        .mockResolvedValue(result);

      expect(await articlesController.deleteArticle(id)).toBe(result);

      expect(deleteArticleSpy).toHaveBeenCalledWith(id);
    });
  });
});
