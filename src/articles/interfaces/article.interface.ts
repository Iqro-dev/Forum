export interface Article {
  id?: string;
  content: string;
  likes: string[];
  dislikes: string[];
  authorID: string;
  date?: Date;
}
