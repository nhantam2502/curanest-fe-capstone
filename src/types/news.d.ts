export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  topic: string;
  created_at: string;
  author: {
    name: string;
    avatar: string;
  };
}

export interface DetailNewsProps {
  post: Post;
}
