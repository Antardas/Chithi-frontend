import { createSlice } from '@reduxjs/toolkit';
import { emptyPostData } from '~/services/utils/static.data';
import { IPost } from '~/types/post';

const initialState = emptyPostData;

interface IAction {
  payload: unknown;
  type: string;
}

interface IUpdatePostAction extends IAction {
  payload: Partial<IPost>;
}

// type Entries<T> = [keyof T, T[keyof T]][];

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    updatePostItem: (state, action: IUpdatePostAction) => {
      for (const [key, value] of Object.entries(action.payload)) {
        state[key] = value;
      }
    },
    clearPostItem: (state) => {
      state = emptyPostData;
      return state;
    }
  }
});
export const { updatePostItem, clearPostItem } = postSlice.actions;
export default postSlice.reducer;
