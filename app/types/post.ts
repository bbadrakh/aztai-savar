import { commentType } from './comment';

export type Post = {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  description: string;
  latitude: string;
  longitude: string;
  imageUrl: string;
  type: string;
  comments: commentType[];
};
