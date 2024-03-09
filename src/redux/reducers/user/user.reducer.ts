import { createSlice } from '@reduxjs/toolkit';
import { IUserState } from '~/types/user';

const initialState: IUserState = { token: '', profile: null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      const { token, profile } = action.payload;
      state.token = token;
      state.profile = profile;
    },

    clearUser: (state) => {
      state.token = '';
      state.profile = null;
    },

    updaterUserProfile: (state, action) => {
      // state.token = '';
      state.profile = action.payload;
    }
  }
});

export const { addUser, updaterUserProfile, clearUser } = userSlice.actions;

export default userSlice.reducer;
