import axios from '~/services/axios';
import { IGetPostsApiResponse, IPostData } from '~/types/post';
import { AddReactionBody, IReactionsCount, PostReactionResponse, UserReactionsResponse } from '~/types/reaction';

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
  async getReactionsByUsername(username: string) {
    const response = await axios.get<UserReactionsResponse>(`/post/single/reactions/${username}`);
    return response;
  }
  async getPostReactionsByUsername(username: string, postId: string) {
    const response = await axios.get<PostReactionResponse>(`/post/single/reaction/${username}/${postId}`);
    return response;
  }
  async addReaction(body: AddReactionBody) {
    const response = await axios.post<PostReactionResponse>(`/post/reaction`, body);
    return response;
  }
  async removeReaction(postId: string, previousReaction: string, postReactions: IReactionsCount) {
    const response = await axios.delete<PostReactionResponse>(`/post/reaction/${postId}/${previousReaction}/${JSON.stringify(postReactions)}`);
    return response;
  }

  async getReactionsByPostId(postId: string) {
    const response = await axios.get<UserReactionsResponse>(`/post/reactions/${postId}`);
    return response;
  }
}

export const postService: PostService = new PostService();
