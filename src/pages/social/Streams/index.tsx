// import React from 'react'
import { AxiosError, isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PostForm from '~/Components/Post/PostForm';
import Posts from '~/Components/Posts';
import Suggestion from '~/Components/Suggestions';
import useEffectOnce from '~/hooks/useEffectOnce';
import useInfinityScroll from '~/hooks/useInfinityScroll';
import useLocalStorage from '~/hooks/useLocalStorage';
import '~/pages/social/Streams/Streams.scss';
import { getPosts } from '~/redux/api/posts';
import { getSuggestions } from '~/redux/api/suggestion';
import { addReactions } from '~/redux/reducers/post/userReactions.reducer';
import { RootState, useAppDispatch } from '~/redux/store';
import { followerService } from '~/services/api/follower/follower.service';
import { postService } from '~/services/api/post/post.service';
import { PostUtils } from '~/services/utils/post-utils.service';
import { Utils } from '~/services/utils/utils.service';
import { IError } from '~/types/axios';
import { IFollower } from '~/types/follower';

const PAGE_SIZE = 10;

const Streams = () => {
  // const [posts, setPosts] = useState<IPost[]>([]);
  const { posts, isLoading, totalPost } = useSelector((state: RootState) => state.posts);
  const { profile } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [followings, setFollowings] = useState<IFollower[]>([]);
  const bodyRef = useRef<HTMLInputElement | null>(null);
  const bottomLineRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const [username] = useLocalStorage('username');
  let timerRef: undefined | ReturnType<typeof setTimeout>;

  const fetchNextPost = () => {
    if (!timerRef) {
      timerRef = setTimeout(() => {
        if (currentPage <= Math.ceil(totalPost / PAGE_SIZE)) {
          setCurrentPage(currentPage + 1);

          // getAllPost();
        }
        timerRef = undefined; // Reset timer reference
      }, 300);
    }
  };

  const getFollowings = async () => {
    try {
      const result = await followerService.getUserFollowing();
      if (result.data.data.length) {
        const newUsers = Utils.uniqueByKey(result.data.data, '_id');
        setFollowings(newUsers);
      }
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };
  const getAllPost = () => {
    setLoading(true);
    try {
      if (currentPage) {
        dispatch(getPosts(currentPage));
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const typedError: AxiosError<IError> = error;
        const message = typedError?.response?.data?.message || 'Something went wrong';
        Utils.dispatchNotification(message, 'error', dispatch);
      } else {
        Utils.dispatchNotification((error as Error).message || 'Something went wrong', 'error', dispatch);
      }
    }
    setLoading(false);
  };

  const getReactionsByUserName = async (username: string) => {
    if (!username) return;
    try {
      const reactions = await postService.getReactionsByUsername(username);
      dispatch(addReactions(reactions.data.reactions));
    } catch (error) {
      if (isAxiosError(error)) {
        const typedError: AxiosError<IError> = error;
        const message = typedError?.response?.data?.message || 'Something went wrong';
        Utils.dispatchNotification(message, 'error', dispatch);
      } else {
        Utils.dispatchNotification((error as Error).message || 'Something went wrong', 'error', dispatch);
      }
    }
  };

  useInfinityScroll(bodyRef, bottomLineRef, fetchNextPost);
  useEffectOnce(() => {
    dispatch(getSuggestions());
    setCurrentPage(currentPage + 1);
    getFollowings();
    // getAllPost();
    // dispatch(getPosts(1));
  });
  console.log('🚀 ~ useEffectOnce ~ dispatch:', dispatch);

  useEffect(() => {
    getAllPost();
  }, [currentPage]);

  useEffect(() => {
    PostUtils.socketIOPost(posts, dispatch);
  }, [posts, dispatch]);

  useEffect(() => {
    getReactionsByUserName(username ?? profile?.username ?? '');
  }, [username]);

  /**
   * How actually calling the API
   * 1. First time getAllPost() called that time if it's find the current page is 0, because yet our state didn't update from the setCurrentPage
   * 2. After Update the Current page again no-2 useEffect called that time it's current page 1
   * after when bottomLine ref visible to body again update the current page and called the API
   */

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          <PostForm />
          {/* <div>Post Items</div>
           */}
          <Posts posts={posts} userFollowing={followings} postsLoading={isLoading} />
          <div
            style={{
              marginBottom: '50px',
              height: '50px'
            }}
            ref={bottomLineRef}
          ></div>
        </div>

        <div className="streams-suggestions">
          <Suggestion />
        </div>
      </div>
    </div>
  );
};

export default Streams;
