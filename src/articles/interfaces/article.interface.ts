export interface Article {
  id?: string;
  title: string;
  content: string;
  likes: string[];
  dislikes: string[];
  authorID: string;
  date?: Date;
}
