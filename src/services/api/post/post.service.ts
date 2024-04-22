import axios from '~/services/axios';
import { OnlyMessageResponse } from '~/types/axios';
import { GetComments, GetCommentsNames, IAddComment } from '~/types/comment';
import { IGetPostsApiResponse, IPostData, IPostDataEdit } from '~/types/post';
import { AddReactionBody, IReactionsCount, PostReactionResponse, UserReactionsResponse } from '~/types/reaction';

class PostService {
  async createPost(body: IPostData) {
    const response = await axios.post('/post', body);
    return response;
  }
  async updatePost(postId: string, body: IPostDataEdit) {
    const response = await axios.put(`/post/${postId}`, body);
    return response;
  }
  async createPostWithImage(body: IPostData) {
    const response = await axios.post('/post/image', body);
    return response;
  }
  async updatePostWithImage(postId: string, body: IPostDataEdit) {
    const response = await axios.put(`/post/image/${postId}`, body);
    return response;
  }

  async deletePost(postId: string) {
    const response = await axios.delete<OnlyMessageResponse>(`/post/${postId}`,);
    return response;
  }

  async getAllPost(page: number = 1) {
    const response = await axios.get<IGetPostsApiResponse>(`/post/all/${page}`);
    return response;
  }

  async getPostWithImage(page: number = 1) {
    const response = await axios.get<IGetPostsApiResponse>(`/post/all/images/${page}`);
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

  async addComment(body: IAddComment) {
    const response = await axios.post<OnlyMessageResponse>(`/comments`, body);
    return response;
  }

  async getPostCommentsNames(postId: string) {
    const response = await axios.get<GetCommentsNames>(`/comments/names/${postId}`);
    return response;
  }
  async getPostComments(postId: string) {
    const response = await axios.get<GetComments>(`/comments/${postId}`);
    return response;
  }
}

export const postService: PostService = new PostService();
