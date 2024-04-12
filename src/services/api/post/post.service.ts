import axios from '~/services/axios';
import { IGetPostsApiResponse, IPostData } from '~/types/post';
import { UserReactionsResponse } from '~/types/reaction';

class PostService {
  async createPost(body: IPostData) {
    const response = await axios.post('/post', body);
    return response;
  }
  async createPostWithImage(body: IPostData) {
    const response = await axios.post('/post/image', body);
    return response;
  }

  async getAllPost(page: number = 1) {
    const response = await axios.get<IGetPostsApiResponse>(`/post/all/${page}`);
    return response;
  }
  async getReactionsByUser(username: string) {
    const response = await axios.get<UserReactionsResponse>(`/post/single/reactions/${username}`);
    return response;
  }
}

export const postService: PostService = new PostService();
