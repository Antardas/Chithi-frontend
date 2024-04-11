// import React from 'react'
import { AxiosError, isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PostForm from '~/Components/Post/PostForm';
import Posts from '~/Components/Posts';
import Suggestion from '~/Components/Suggestions';
import useEffectOnce from '~/hooks/useEffectOnce';
import useInfinityScroll from '~/hooks/useInfinityScroll';
import '~/pages/social/Streams/Streams.scss';
import { getPosts } from '~/redux/api/posts';
import { getSuggestions } from '~/redux/api/suggestion';
import { RootState, useAppDispatch } from '~/redux/store';
import { PostUtils } from '~/services/utils/post-utils.service';
import { Utils } from '~/services/utils/utils.service';
import { IError } from '~/types/axios';

const PAGE_SIZE = 10;

const Streams = () => {
  // const [posts, setPosts] = useState<IPost[]>([]);
  const { posts, isLoading, totalPost } = useSelector((state: RootState) => state.posts);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const bodyRef = useRef<HTMLInputElement | null>(null);
  const bottomLineRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  const fetchNextPost = () => {
    console.log('caleed');

    if (currentPage <= Math.ceil(totalPost / PAGE_SIZE)) {
      setCurrentPage(currentPage + 1);

      // getAllPost();
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

  useInfinityScroll(bodyRef, bottomLineRef, fetchNextPost);
  useEffectOnce(() => {
    dispatch(getSuggestions());
    setCurrentPage(currentPage + 1);
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
          <Posts posts={posts} userFollowing={[]} postsLoading={isLoading} />
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
