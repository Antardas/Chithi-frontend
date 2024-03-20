import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import userReducer from '~/redux/reducers/user/user.reducer';
import suggestionReducer from '~/redux/reducers/suggestion/suggestion.reducer';
import notificationReducer from '~/redux/reducers/notification/notification.reducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    suggestion: suggestionReducer,
    notification: notificationReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;

export { store };
