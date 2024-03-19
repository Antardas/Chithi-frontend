import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import userReducer from '~/redux/reducers/user/user.reducer';
import userSuggestion from '~/redux/reducers/suggestion/suggestion.reducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    suggestion: userSuggestion
  }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>

export { store };
