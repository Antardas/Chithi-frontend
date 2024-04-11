import { createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '~/services/api/post/post.service';
import { IGetPostsApiResponse } from '~/types/post';
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import { Utils } from '~/services/utils/utils.service';
import { IError } from '~/types/axios';
import { AppDispatch } from '~/redux/store';
const getPosts = createAsyncThunk('posts/getPosts', async (page: number, { dispatch }) => {
  try {
    const response: AxiosResponse<IGetPostsApiResponse> = await postService.getAllPost(page);

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const typedError: AxiosError<IError> = error;
      const message = typedError?.response?.data?.message || 'Something went wrong';
      Utils.dispatchNotification(message, 'error', dispatch as AppDispatch);
    } else {
      Utils.dispatchNotification((error as Error).message, 'error', dispatch as AppDispatch);
    }
  }
});
export {
  getPosts
}