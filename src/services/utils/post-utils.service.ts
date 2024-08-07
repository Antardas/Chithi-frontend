import { socketService } from '~/services/socket/sokcet.service';
import { Utils } from '~/services/utils/utils.service';
import { closeModal } from '~/redux/reducers/modal/modal.reducer';
import { clearPostItem, updatePostItem } from '~/redux/reducers/post/post.reducer';
import { AppDispatch, RootState, store } from '~/redux/store';
import { IPost, IPostData, IPostDataEdit } from '~/types/post';
import { postService } from '../api/post/post.service';
import { NotificationType } from '~/Components/Toast';
import { AxiosError, isAxiosError } from 'axios';
import { IError } from '~/types/axios';
import { IUser } from '~/types/user';
import { addPosts } from '~/redux/reducers/post/posts.reducer';
import { IReactionsCount, ReactionType, SocketReactionResponse } from '~/types/reaction';
import millify from 'millify';
import { ICommentSocketResponse } from '~/types/comment';

export class PostUtils {
  static selectBackgroundColor<T extends IPostData | IPostDataEdit>({
    bgColor,
    postData,
    setTextAreaBackground,
    setPostData
  }: ISelectBackgroundColorParams<T>) {
    postData.bgColor = bgColor;
    setTextAreaBackground(bgColor);
    setPostData(postData);
  }

  static postInputEditable<T extends IPostData | IPostDataEdit>({ postData, setPostData, textContent }: IPostInputEditable<T>) {
    postData.post = textContent;
    setPostData(postData);
  }

  static closePostModal(dispatch: AppDispatch) {
    dispatch(closeModal());
    dispatch(clearPostItem());
  }

  static clearImage<T extends IPostData | IPostDataEdit>({
    postData,
    post,
    dispatch,
    inputRef,
    setPostData,
    setPostImage,
    setSelectedPostImage
  }: IClearImage<T>) {
    postData.gifUrl = '';
    postData.image = '';
    postData.video = '';
    setSelectedPostImage(undefined);
    setPostImage('');
    setTimeout(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.textContent = !post ? postData.post : post;
        if (post) {
          postData.post = post;
        }

        setPostData(postData);
      }
      PostUtils.positionCursor('editable');
    });

    dispatch(
      updatePostItem({
        gifUrl: '',
        image: '',
        imgId: '',
        imgVersion: '',
        video: '',
        videoId: '',
        videoVersion: ''
      })
    );
  }

  static postInputData({ imageInputRef, postData, post, setPostData }: IPostInputInputData) {
    setTimeout(() => {
      if (imageInputRef && imageInputRef.current) {
        imageInputRef.current.textContent = !post ? postData.post : post;
        if (post) {
          postData.post = post;
        }

        setPostData(postData);
        PostUtils.positionCursor('editable');
      }
    });
  }

  static addNotification({ dispatch, message, setApiResponse, setLoading, type }: IAddNotification) {
    setApiResponse(type);
    setLoading(false);
    Utils.dispatchNotification(message, type, dispatch);
  }

  static async sendPostWithMedia({ dispatch, file, imageInputRef, postData, setApiResponse, setLoading, mediaType }: ISendPostWithImage) {
    try {
      if (mediaType === 'image') {
        postData.image = file;
        postData.video = '';
      } else {
        postData.video = file;
        postData.image = '';
      }

      if (imageInputRef.current) {
        imageInputRef.current.textContent = postData.post;
      }

      const response = mediaType === 'image' ? await postService.createPostWithImage(postData) : await postService.createPostWithVideo(postData);
      if (response) {
        setApiResponse('success');
        setLoading(false);
      }
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        const typedError: AxiosError<IError> = error;
        const message = typedError?.response?.data?.message || 'Something went wrong';
        PostUtils.addNotification({ dispatch, message, setApiResponse, setLoading, type: 'error' });
      } else {
        PostUtils.addNotification({
          dispatch,
          message: (error as Error).message || 'Something went wrong',
          setApiResponse,
          setLoading,
          type: 'error'
        });
      }
    }
  }

  static async updatePostWithMedia({ dispatch, postData, postId, setApiResponse, setLoading, mediaType }: IUpdatePostWithImage) {
    try {
      const response =
        mediaType === 'image' ? await postService.updatePostWithImage(postId, postData) : await postService.updatePostWithVideo(postId, postData);

      if (response) {
        // setApiResponse('success');
        setLoading(false);
        const message: string = response.data?.message as string;
        PostUtils.addNotification({ dispatch, message, setApiResponse, setLoading, type: 'success' });

        setTimeout(() => {
          setApiResponse('success');
          setLoading(false);
        }, 3000);
      }
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        const typedError: AxiosError<IError> = error;
        const message = typedError?.response?.data?.message || 'Something went wrong';
        PostUtils.addNotification({ dispatch, message, setApiResponse, setLoading, type: 'error' });
      } else {
        PostUtils.addNotification({
          dispatch,
          message: (error as Error).message || 'Something went wrong',
          setApiResponse,
          setLoading,
          type: 'error'
        });
      }
    }
  }

  static async updatePost({ dispatch, postData, postId, setApiResponse, setLoading }: IUpdatePost) {
    try {
      const response = await postService.updatePost(postId, postData);

      if (response) {
        setLoading(false);
        const message: string = response.data?.message as string;
        PostUtils.addNotification({ dispatch, message, setApiResponse, setLoading, type: 'success' });

        setTimeout(() => {
          setApiResponse('success');
          setLoading(false);
        }, 3000);
      }
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        const typedError: AxiosError<IError> = error;
        const message = typedError?.response?.data?.message || 'Something went wrong';
        PostUtils.addNotification({ dispatch, message, setApiResponse, setLoading, type: 'error' });
      } else {
        PostUtils.addNotification({
          dispatch,
          message: (error as Error).message || 'Something went wrong',
          setApiResponse,
          setLoading,
          type: 'error'
        });
      }
    }
  }

  static checkPrivacy(post: IPost, profile: IUser, following: string[]) {
    const isPrivate = post.privacy === 'Private' && post.userId === profile._id;

    const isPublic = post.privacy === 'Public';

    // means if I have already followed that author || or that author in my following array
    const isFollowers =
      (post.privacy === 'Followers' && Utils.checkIfUserIsFollowed(following, post.userId, profile._id)) || post.userId === profile._id;
    return isPrivate || isPublic || isFollowers;
  }

  static positionCursor(elementId: string) {
    if (window && window.document) {
      const element = document.getElementById(`${elementId}`);
      if (element) {
        const selections = window.getSelection();
        const range = document.createRange();

        selections?.removeAllRanges();
        range.selectNodeContents(element);
        range.collapse(false);
        selections?.addRange(range);
        element.focus();
      }
    }
  }

  static addPostListener(data: IPost) {
    const posts = store.getState().posts.posts;
    const clonedPosts = Utils.cloneDeep(posts) as IPost[];
    const { profile } = store.getState().user;
    if (!profile?.blockedBy.find((item) => item === data.userId)) {
      clonedPosts.unshift(data);

      store.dispatch(addPosts(clonedPosts));
    }
  }
  static updatePostListener(data: IPost) {
    const posts = store.getState().posts.posts;
    console.log('🚀 ~ PostUtils ~ socketService.socket.on ~ data:', data);

    PostUtils.updateSinglePost(posts, data, store.dispatch);
  }

  static deletePostListener(postId: string) {
    const posts = store.getState().posts.posts;
    let clonedPosts = Utils.cloneDeep(posts) as IPost[];
    clonedPosts = clonedPosts.filter((data) => data._id !== postId);
    store.dispatch(addPosts(clonedPosts));
  }

  static updateLikePostListener(data: SocketReactionResponse) {
    const posts = store.getState().posts.posts;
    const postIndex = posts.findIndex((item) => item._id === data.postId);

    if (postIndex !== 1) {
      const updatedPost = {
        ...posts[postIndex],
        reactions: data.postReactions
      };
      PostUtils.updateSinglePost(posts, updatedPost, store.dispatch);
    }
  }

  static updateCommentPostListener(data: ICommentSocketResponse) {
    const posts = store.getState().posts.posts;
    const post = posts.find((item) => item._id === data.postId);
    if (post) {
      post.commentCount = data.commentsCount;
      PostUtils.updateSinglePost(posts, post, store.dispatch);
    }
  }

  static socketIOPost() {
    socketService.socket?.on('addPost', PostUtils.addPostListener);

    socketService.socket?.on('update post', PostUtils.updatePostListener);

    socketService.socket?.on('delete post', PostUtils.deletePostListener);

    // TODO: fix the Type
    socketService.socket?.on('update like', PostUtils.updateLikePostListener);
    // TODO: fix the Type
    socketService.socket?.on('update comment', PostUtils.updateCommentPostListener);
  }

  static updateSinglePost(posts: IPost[], post: IPost, dispatch: AppDispatch) {
    const clonedPosts = Utils.cloneDeep(posts) as IPost[];
    const index = clonedPosts.findIndex((data) => data._id === post._id);
    if (index >= 0) {
      clonedPosts.splice(index, 1, post);
      dispatch(addPosts(clonedPosts));
    }
  }

  static formatReactionsCount(reactions: IReactionsCount): FormattedReactionCount[] {
    const newFormattedReactions: FormattedReactionCount[] = [];
    Object.entries(reactions).forEach(([key, value]) => {
      if (value > 0) {
        newFormattedReactions.push({
          type: key as ReactionType,
          value
        });
      }
    });
    return newFormattedReactions;
  }

  static shortenLargeNumberReactions(data: number): string {
    if (!data) {
      return '0';
    } else {
      return millify(data);
    }
  }
}

interface ISelectBackgroundColorParams<T> {
  bgColor: string;
  postData: T;
  setTextAreaBackground: SetState<string>;
  setPostData: SetState<T>;
}

interface IPostInputEditable<T> {
  textContent: string;
  postData: T;
  setPostData: SetState<T>;
}

interface IClearImage<T> {
  postData: T;
  post: string;
  inputRef: React.RefObject<HTMLDivElement>;
  dispatch: AppDispatch;
  setSelectedPostImage: SetState<File | undefined>;
  setPostImage: SetState<string>;
  setPostData: SetState<T>;
}

interface IPostInputInputData
  extends Omit<IClearImage<IPostDataEdit | IPostData>, 'dispatch' | 'setPostImage' | 'inputRef' | 'setSelectedPostImage'> {
  imageInputRef: React.RefObject<HTMLDivElement>;
}

interface ISendPostWithImage {
  file: string;
  postData: IPostData;
  imageInputRef: React.RefObject<HTMLDivElement>;
  setApiResponse: SetState<string>;
  setLoading: SetState<boolean>;
  dispatch: AppDispatch;
  mediaType: 'image' | 'video';
}
interface IUpdatePostWithImage extends Omit<ISendPostWithImage, 'imageInputRef' | 'postData' | 'file'> {
  postId: string;
  postData: IPostDataEdit;
}
interface IUpdatePost extends Omit<IUpdatePostWithImage, 'file' | 'mediaType'> {
  postId: string;
  postData: IPostDataEdit;
}

type IAddNotification = Omit<ISendPostWithImage, 'file' | 'postData' | 'imageInputRef' | 'mediaType'> & {
  message: string;
  type: NotificationType;
};
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type FormattedReactionCount = { type: ReactionType; value: number | string };
