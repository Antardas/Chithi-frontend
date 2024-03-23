import { createSlice } from '@reduxjs/toolkit';
import { IAppState } from '~/types/app';

const initialState: IAppState = { socketConnected: false };

const appSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSocketConnected: (state, action) => {
      const { socketConnected } = action.payload;
      state.socketConnected = socketConnected;
    }
  }
});

export const { setSocketConnected} = appSlice.actions;

export default appSlice.reducer;
