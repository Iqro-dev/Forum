import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
  @Prop()
  content: string;

  @Prop()
  authorID: string;

  @Prop({ default: () => [] })
  likes: string[];

  @Prop({ default: () => [] })
  dislikes: string[];

  @Prop({ default: Date.now })
  date?: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
