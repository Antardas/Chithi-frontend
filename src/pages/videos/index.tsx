import { useState } from 'react';
import { useSelector } from 'react-redux';
import useEffectOnce from '~/hooks/useEffectOnce';
import { RootState, useAppDispatch } from '~/redux/store';
import { followerService } from '~/services/api/follower/follower.service';
import { postService } from '~/services/api/post/post.service';
import { PostUtils } from '~/services/utils/post-utils.service';
import { Utils } from '~/services/utils/utils.service';
import { IFollower } from '~/types/follower';
import { IPost } from '~/types/post';
import { IUser } from '~/types/user';
import '~/pages/videos/Videos.scss';
const Videos = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [following, setFollowing] = useState<IFollower[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  const getPostsWithVideos = async () => {
    try {
      const response = await postService.getPostsWithVideos(1);
      setPosts(response.data.posts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Utils.addErrorNotification(error, dispatch);
    }
  };

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.data);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  const emptyPost = (post: IPost) => {
    return (
      Utils.checkIfUserIsBlocked(profile?.blockedBy as string[], post?.userId) ||
      PostUtils.checkPrivacy(
        post,
        profile as IUser,
        following.map((user) => user._id)
      )
    );
  };

  useEffectOnce(() => {
    getPostsWithVideos();
    getUserFollowing();
  });

  return (
    <>
      <div className="videos-container">
        <div className="videos">Videos</div>
        {posts.length > 0 && (
          <div className="gallery-videos">
            {posts.map((post) => (
              <div key={Utils.generateString(10)} className={`${!emptyPost(post) ? 'empty-post-div' : ''}`} data-testid="gallery-videos">
                {(!Utils.checkIfUserIsBlocked(profile?.blockedBy as string[], post?.userId) || post?.userId === profile?._id) && (
                  <>
                    {PostUtils.checkPrivacy(
                      post,
                      profile as IUser,
                      following.map((user) => user._id)
                    ) && (
                      <figure data-testid="video">
                        <div className="video">
                          <video
                            width="350px"
                            height="200px"
                            autoPlay={false}
                            controls
                            src={`${Utils.generateVideoUrl(post?.videoVersion as string, post?.videoId as string)}`}
                          />
                        </div>
                      </figure>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {loading && !posts.length && <div className="card-element" style={{ height: '350px' }}></div>}

        {!loading && !posts.length && (
          <div className="empty-page" data-testid="empty-page">
            There are no videos to display
          </div>
        )}
      </div>
    </>
  );
};

export default Videos;
