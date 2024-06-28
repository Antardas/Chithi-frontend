import React, { useCallback, useEffect, useState } from 'react';
import '~/Components/Timeline/Timeline.scss';
import CountContainer from './CountContainer';
import { IUser } from '~/types/user';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '~/redux/store';
import useLocalStorage from '~/hooks/useLocalStorage';
import { useParams } from 'react-router-dom';
import useEffectOnce from '~/hooks/useEffectOnce';
import { PostUtils } from '~/services/utils/post-utils.service';
import { followerService } from '~/services/api/follower/follower.service';
import { Utils } from '~/services/utils/utils.service';
import { IFollower } from '~/types/follower';
import { IPost } from '~/types/post';
import { addReactions } from '~/redux/reducers/post/userReactions.reducer';
import { postService } from '~/services/api/post/post.service';
import PostFormSkeleton from '../Post/PostForm/PostFormSkeleton';
import PostSkeleton from '../Post/PostSkeleton';
import Post from '../Post';
import PostForm from '../Post/PostForm';
import { addPosts } from '~/redux/reducers/post/posts.reducer';
import SocialLinks from './SocialLinks';
import BasicInfo from './BasicInfo';
const Timeline = ({ loading, userProfileData, posts: userPosts }: Props) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { posts } = useSelector((state: RootState) => state.posts);
  // const [posts, setPosts] = useState<IPost[]>([]);
  const [user, setUser] = useState<IUser>();
  const [following, setFollowing] = useState<string[]>([]);
  const [editableInputs, setEditableInputs] = useState({
    quote: '',
    work: '',
    school: '',
    location: ''
  });
  const [editableSocialInputs, setEditableSocialInputs] = useState({
    instagram: '',
    twitter: '',
    facebook: '',
    youtube: ''
  });
  const { username } = useParams();
  const dispatch = useAppDispatch();
  const [storedUsername] = useLocalStorage('username');

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      if (response.data.data) {
        setFollowing(response.data.data.map((user) => user._id));
      }
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  const getUserByUsername = useCallback(() => {
    if (userProfileData) {
      dispatch(addPosts(userPosts));
      setUser(userProfileData);
      setEditableInputs({
        quote: userProfileData.quote,
        work: userProfileData.work,
        school: userProfileData.school,
        location: userProfileData.location
      });
      setEditableSocialInputs(userProfileData?.social);
    }
  }, [userProfileData, userPosts]);

  const getReactionsByUsername = async () => {
    try {
      if (storedUsername) {
        const reactionsResponse = await postService.getReactionsByUsername(storedUsername);
        dispatch(addReactions(reactionsResponse.data.reactions));
      }
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  useEffectOnce(() => {
    getUserFollowing();
    getReactionsByUsername();
  });

  useEffect(() => {
    if (username !== profile?.username) {
      const firstPost = document.querySelectorAll<HTMLElement>('.post-body')[0];
      if (firstPost) {
        firstPost.style.marginTop = '0';
      }
    }
  }, [username, profile]);

  useEffect(() => {
    getUserByUsername();
  }, [getUserByUsername]);

  useEffect(() => {
    PostUtils.socketIOPost();
  }, []);
  return (
    <div className="timeline-wrapper" data-testid="timeline">
      <div className="timeline-wrapper-container">
        <div className="timeline-wrapper-container-side">
          <div className="timeline-wrapper-container-side-count">
            <CountContainer followersCount={userProfileData?.followersCount} followingCount={userProfileData?.followingCount} loading={loading} />
          </div>
          <div className="side-content">
            <BasicInfo
              setEditableInputs={setEditableInputs}
              editableInputs={editableInputs}
              username={username as string}
              profile={profile as IUser}
              loading={loading}
            />
          </div>
          <div className="side-content social">
            <SocialLinks
              setEditableSocialInputs={setEditableSocialInputs}
              editableSocialInputs={editableSocialInputs}
              username={username as string}
              profile={profile as IUser}
              loading={loading}
            />
          </div>
        </div>
        {loading && !posts.length && (
          <div className="timeline-wrapper-container-main">
            <div style={{ marginBottom: '10px' }}>
              <PostFormSkeleton />
            </div>
            <>
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index}>
                  <PostSkeleton />
                </div>
              ))}
            </>
          </div>
        )}
        {!loading && posts.length > 0 && (
          <div className="timeline-wrapper-container-main">
            {username === profile?.username && <PostForm />}
            {posts.map((post) => (
              <div key={`post-container-${post._id}`} data-testid="posts-item">
                {!Utils.checkIfUserIsBlocked(profile?.blockedBy as string[], post.userId) || post.userId === profile?._id ? (
                  PostUtils.checkPrivacy(post, profile as IUser, following) ? (
                    <Post post={post} showIcons={username === profile?.username} loading={loading} key={`post-${post._id}`} />
                  ) : null
                ) : null}
              </div>
            ))}
          </div>
        )}
        {!loading && posts.length === 0 && (
          <div className="timeline-wrapper-container-main">
            <div className="empty-page" data-testid="empty-page">
              No post available
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;

interface Props {
  userProfileData: IUser;
  posts: IPost[];
  loading: boolean;
}
