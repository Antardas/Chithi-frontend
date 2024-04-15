import { socketService } from '~/services/socket/sokcet.service';
import { Utils } from '~/services/utils/utils.service';
import { closeModal } from '~/redux/reducers/modal/modal.reducer';
import { clearPostItem, updatePostItem } from '~/redux/reducers/post/post.reducer';
import { AppDispatch } from '~/redux/store';
import { IPost, IPostData } from '~/types/post';
import { postService } from '../api/post/post.service';
import { NotificationType } from '~/Components/Toast';
import { AxiosError, isAxiosError } from 'axios';
import { IError } from '~/types/axios';
import { IUser } from '~/types/user';
import { addPosts } from '~/redux/reducers/post/posts.reducer';
import { IReactionsCount, ReactionType, SocketReactionResponse } from '~/types/reaction';
import millify from 'millify';

export class PostUtils {
  static selectBackgroundColor({ bgColor, postData, setTextAreaBackground, setPostData }: ISelectBackgroundColorParams) {
    postData.bgColor = bgColor;
    setTextAreaBackground(bgColor);
    setPostData(postData);
  }

  static postInputEditable({ postData, setPostData, textContent }: IPostInputEditable) {
    postData.post = textContent;
    setPostData(postData);
  }

  static closePostModal(dispatch: AppDispatch) {
    dispatch(closeModal());
    dispatch(clearPostItem());
  }

  static clearImage({ postData, post, dispatch, inputRef, setPostData, setPostImage, setSelectedPostImage }: IClearImage) {
    postData.gifUrl = '';
    postData.image = '';
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
        imgVersion: ''
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

  static async sendPostWithImage({ dispatch, file, imageInputRef, postData, setApiResponse, setLoading }: ISendPostWithImage) {
    try {
      postData.image = file;
      if (imageInputRef.current) {
        imageInputRef.current.textContent = postData.post;
      }

      const response = await postService.createPostWithImage(postData);
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

  static checkPrivacy(post: IPost, profile: IUser, following: string[]) {
    const isPrivate = post.privacy === 'Private' && post.userId === profile._id;

    const isPublic = post.privacy === 'Public';

    // means if I have already followed that author || or that author in my following array
    const isFollowers = post.privacy === 'Followers' && Utils.checkIfUserIsFollowed(following, post.userId, profile._id);

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

  static socketIOPost(posts: IPost[], dispatch: AppDispatch) {
    const clonedPosts = Utils.cloneDeep(posts) as IPost[];
    socketService.socket.on('addPost', (data: IPost) => {
      clonedPosts.unshift(data);
      dispatch(addPosts(clonedPosts));
    });

    socketService.socket.on('update post', (data: IPost) => {
      PostUtils.updateSinglePost(posts, data, dispatch);
    });

    socketService.socket.on('delete post', (postId: string) => {
      let clonedPosts = Utils.cloneDeep(posts) as IPost[];
      clonedPosts = clonedPosts.filter((data) => data._id !== postId);
      dispatch(addPosts(clonedPosts));
    });

    // TODO: fix the Type
    socketService.socket.on('update like', (data: SocketReactionResponse) => {
      const post = posts.find((item) => item._id === data.postId);

      if (post) {
        post.reactions = data.postReactions;
        PostUtils.updateSinglePost(posts, post, dispatch);
      }
    });
    // TODO: fix the Type
    socketService.socket.on('update comment', (data: object) => {
      const post = posts.find((item) => item._id === data.postId);
      if (post) {
        post.commentCount = data;
        PostUtils.updateSinglePost(posts, post, dispatch);
      }
    });
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

interface ISelectBackgroundColorParams {
  bgColor: string;
  postData: IPostData;
  setTextAreaBackground: SetState<string>;
  setPostData: SetState<IPostData>;
}

interface IPostInputEditable {
  textContent: string;
  postData: IPostData;
  setPostData: SetState<IPostData>;
}

interface IClearImage {
  postData: IPostData;
  post: string;
  inputRef: React.RefObject<HTMLDivElement>;
  dispatch: AppDispatch;
  setSelectedPostImage: SetState<File | undefined>;
  setPostImage: SetState<string>;
  setPostData: SetState<IPostData>;
}

interface IPostInputInputData extends Omit<IClearImage, 'dispatch' | 'setPostImage' | 'inputRef' | 'setSelectedPostImage'> {
  imageInputRef: React.RefObject<HTMLDivElement>;
}

interface ISendPostWithImage {
  file: string;
  postData: IPostData;
  imageInputRef: React.RefObject<HTMLDivElement>;
  setApiResponse: SetState<string>;
  setLoading: SetState<boolean>;
  dispatch: AppDispatch;
}

type IAddNotification = Omit<ISendPostWithImage, 'file' | 'postData' | 'imageInputRef'> & {
  message: string;
  type: NotificationType;
};
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type FormattedReactionCount = { type: ReactionType; value: number | string };
