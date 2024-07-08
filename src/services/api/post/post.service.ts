import axiosInstance from '~/services/axios';
import { OnlyMessageResponse } from '~/types/axios';
import { GetComments, GetCommentsNames, IAddComment } from '~/types/comment';
import { IGetPostsApiResponse, IPostData, IPostDataEdit } from '~/types/post';
import { AddReactionBody, IReactionsCount, PostReactionResponse, UserReactionsResponse } from '~/types/reaction';

class PostService {
  async createPost(body: IPostData) {
    const response = await axiosInstance.post('/post', body);
    return response;
  }
  async updatePost(postId: string, body: IPostDataEdit) {
    const response = await axiosInstance.put(`/post/${postId}`, body);
    return response;
  }
  async createPostWithImage(body: IPostData) {
    const response = await axiosInstance.post('/post/image', body);
    return response;
  }
  async updatePostWithImage(postId: string, body: IPostDataEdit) {
    const response = await axiosInstance.put(`/post/image/${postId}`, body);
    return response;
  }

  async createPostWithVideo(body: IPostData) {
    const response = await axiosInstance.post('/post/video', body);
    return response;
  }
  async updatePostWithVideo(postId: string, body: IPostDataEdit) {
    const response = await axiosInstance.put(`/post/video/${postId}`, body);
    return response;
  }

  async deletePost(postId: string) {
    const response = await axiosInstance.delete<OnlyMessageResponse>(`/post/${postId}`,);
    return response;
  }

  async getAllPost(page: number = 1) {
    const response = await axiosInstance.get<IGetPostsApiResponse>(`/post/all/${page}`);
    return response;
  }

  async getPostWithImage(page: number = 1) {
    const response = await axiosInstance.get<IGetPostsApiResponse>(`/post/all/images/${page}`);
    return response;
  }
  async getPostsWithVideos(page: number = 1) {
    const response = await axiosInstance.get<IGetPostsApiResponse>(`/post/all/videos/${page}`);
    return response;
  }
  async getReactionsByUsername(username: string) {
    const response = await axiosInstance.get<UserReactionsResponse>(`/post/single/reactions/${username}`);
    return response;
  }
  async getPostReactionsByUsername(username: string, postId: string) {
    const response = await axiosInstance.get<PostReactionResponse>(`/post/single/reaction/${username}/${postId}`);
    return response;
  }
  async addReaction(body: AddReactionBody) {
    const response = await axiosInstance.post<PostReactionResponse>(`/post/reaction`, body);
    return response;
  }
  async removeReaction(postId: string, previousReaction: string, postReactions: IReactionsCount) {
    const response = await axiosInstance.delete<PostReactionResponse>(`/post/reaction/${postId}/${previousReaction}/${JSON.stringify(postReactions)}`);
    return response;
  }

  async getReactionsByPostId(postId: string) {
    const response = await axiosInstance.get<UserReactionsResponse>(`/post/reactions/${postId}`);
    return response;
  }

  async addComment(body: IAddComment) {
    const response = await axiosInstance.post<OnlyMessageResponse>(`/comments`, body);
    return response;
  }

  async getPostCommentsNames(postId: string) {
    const response = await axiosInstance.get<GetCommentsNames>(`/comments/names/${postId}`);
    return response;
  }
  async getPostComments(postId: string) {
    const response = await axiosInstance.get<GetComments>(`/comments/${postId}`);
    return response;
  }
}

export const postService: PostService = new PostService();
