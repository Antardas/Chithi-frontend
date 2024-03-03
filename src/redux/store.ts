import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import userReducer from '~/redux/reducers/user/user.reducer';

const store = configureStore({
  reducer: {
    user: userReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export { store };
