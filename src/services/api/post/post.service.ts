import axios from '~/services/axios';
import { IGetPostsApiResponse, IPostData } from '~/types/post';

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
}

export const postService: PostService = new PostService();
