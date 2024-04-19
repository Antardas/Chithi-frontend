import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import userReducer from '~/redux/reducers/user/user.reducer';
import suggestionReducer from '~/redux/reducers/suggestion/suggestion.reducer';
import notificationReducer from '~/redux/reducers/notification/notification.reducer';
import appReducer from '~/redux/reducers/app/app.reducer';
import modalReducer from '~/redux/reducers/modal/modal.reducer';
import postReducer from '~/redux/reducers/post/post.reducer';
import postsReducer from '~/redux/reducers/post/posts.reducer';
import userReactionsReducer from '~/redux/reducers/post/userReactions.reducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    suggestion: suggestionReducer,
    notification: notificationReducer,
    app: appReducer,
    modal: modalReducer,
    post: postReducer,
    posts: postsReducer,
    userReactions: userReactionsReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export { store };
