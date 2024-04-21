import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '~/Components/Posts/Posts.scss';
import { RootState } from '~/redux/store';
import { IPost } from '~/types/post';
import Post from '~/Components/Post';
import { Utils } from '~/services/utils/utils.service';
import { PostUtils } from '~/services/utils/post-utils.service';
import { IUser } from '~/types/user';
import PostSkeleton from '../Post/PostSkeleton';
export interface IPostsProps {
  posts: IPost[];
  userFollowing: unknown[];
  postsLoading?: boolean;
}
const Posts = ({ posts, userFollowing, postsLoading }: IPostsProps) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [followings, setFollowings] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // later I will use the Profile, userFollowing, postsLoading
  return (
    <div className="post-container" data-testid="posts">
      {postsLoading ? <PostsSkeleton /> : null}
      {posts.map((post) => (
        <div key={`post-container-${post._id}`} data-testid="posts-item">
          {!Utils.checkIfUserIsBlocked(profile?.blockedBy as string[], post.userId)|| post.userId === profile?._id  ? (
            PostUtils.checkPrivacy(post, profile as IUser, followings) ? (
              <Post post={post} showIcons={false} loading={loading} key={`post-${post._id}`} />
            ) : null
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Posts;

const PostsSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index}>
          <PostSkeleton />
        </div>
      ))}
    </>
  );
};
