import { createSlice } from '@reduxjs/toolkit';
import { getPosts } from '~/redux/api/posts';
import { Utils } from '~/services/utils/utils.service';
import { IGetPostsApiResponse, IPost } from '~/types/post';

interface IInitialState {
  isLoading: boolean;
  posts: IPost[];
  totalPost: number;
}
const initialState: IInitialState = {
  isLoading: false,
  posts: [],
  totalPost: 0
};
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPosts: (state, action) => {
      state.posts = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getPosts.fulfilled, (state, action) => {
      const { posts, totalPost } = action.payload as IGetPostsApiResponse;
      state.isLoading = false;
      const uniquePosts = [...state.posts, ...posts];
      state.posts = Utils.uniqueByKey(uniquePosts, '_id');
      state.totalPost = totalPost;
    });
    builder.addCase(getPosts.rejected, (state) => {
      state.isLoading = false;
    });
  }
});
export const { addPosts } = postsSlice.actions;
export default postsSlice.reducer;
