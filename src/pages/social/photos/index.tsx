import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import GalleryImage from '~/Components/GalleryImage';
import useEffectOnce from '~/hooks/useEffectOnce';
import { RootState, useAppDispatch } from '~/redux/store';
import { followerService } from '~/services/api/follower/follower.service';
import { postService } from '~/services/api/post/post.service';
import { PostUtils } from '~/services/utils/post-utils.service';
import { Utils } from '~/services/utils/utils.service';
import { IFollower } from '~/types/follower';
import { IPost } from '~/types/post';
import { IUser } from '~/types/user';
import '~/pages/social/photos/Photos.scss';
import ImageModal from '~/Components/ImageModal';
const Photos = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [followings, setFollowings] = useState<IFollower[]>([]);
  const { profile } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [rightImageIndex, setRightImageIndex] = useState(0);
  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [lastItemRight, setLastItemRight] = useState(false);
  const [lastItemLeft, setLastItemLeft] = useState(false);

  const getPostsWithImages = async () => {
    setLoading(true);
    try {
      const result = await postService.getPostWithImage(1);
      const filteredPosts = result.data.posts.reduce((acc: IPost[], cur: IPost) => {
        if ((profile?.blockedBy && !Utils.checkIfUserIsBlocked(profile?.blockedBy as string[], cur.userId)) || cur.userId === profile?._id) {
          if (
            PostUtils.checkPrivacy(
              cur,
              profile as IUser,
              followings.map((item) => item._id)
            )
          ) {
            acc.push(cur);
          }
        }
        return acc;
      }, []);
      setPosts([...filteredPosts]);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
    setLoading(false);
  };

  const getFollowings = async () => {
    setLoading(true);
    try {
      const result = await followerService.getUserFollowing();
      setFollowings(result.data.data);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
    setLoading(false);
  };

  const postImageUrl = (post: IPost) => {
    if (post.imgId && post.imgVersion) {
      return Utils.generateImageUrl(post.imgVersion, post.imgId);
    } else {
      return post.gifUrl ?? '';
    }
  };

  const emptyPost = (post: IPost) => {
    return (
      Utils.checkIfUserIsBlocked(profile?.blockedBy as string[], post.userId) ||
      PostUtils.checkPrivacy(
        post,
        profile as IUser,
        followings.map((item) => item._id)
      )
    );
  };

  const displayImage = (post: IPost) => {
    const imgUrl = post?.gifUrl ? post.gifUrl : Utils.generateImageUrl(post.imgVersion as string, post.imgId as string);
    setImageUrl(imgUrl);
  };

  const onClickRight = () => {
    if (rightImageIndex === posts.length - 2) {
      setLastItemRight(true);
      // return;
    }
    setLastItemLeft(false);
    setRightImageIndex((index) => index + 1);
    const lastImage = posts[posts.length - 1];
    const post = posts[rightImageIndex];
    displayImage(post);
    setLeftImageIndex(rightImageIndex);
    // if (Utils.cloneDeep(posts[rightImageIndex]) === Utils.cloneDeep(lastImage)) {
    //   setLastItemRight(true);
    // }
  };
  const onClickLeft = () => {
    console.log(leftImageIndex, rightImageIndex);
    if (leftImageIndex === 0 + 1) {
      setLastItemLeft(true);
      // return;
    }
    setLastItemRight(false);
    setLeftImageIndex((index) => index - 1);
    const firstImage = posts[0];
    const post = posts[leftImageIndex - 1];
    displayImage(post);
    setRightImageIndex(leftImageIndex);
    // if (Utils.cloneDeep(post) === Utils.cloneDeep(firstImage)) {
    //   setLastItemLeft(true);
    // }
  };

  useEffectOnce(() => {
    getFollowings();
    getPostsWithImages();
  });
  return (
    <>
      {showImageModal ? (
        <ImageModal
          image={imageUrl}
          showArrow={true}
          onClickRight={onClickRight}
          onClickLeft={onClickLeft}
          onCancel={() => {
            setRightImageIndex(0);
            setLeftImageIndex(0);
            setLastItemLeft(false);
            setLastItemRight(false);
            setShowImageModal(false);
          }}
          lastItemLeft={lastItemLeft}
          lastItemRight={lastItemRight}
        />
      ) : null}
      <div className="photos-container">
        <div className="photos">Photos</div>
        <div className="gallery-images" data-testid="gallery-images">
          {posts.map((post, index) => (
            <div key={post._id} className={!emptyPost(post) ? 'empty-post-div' : ''}>
              {!Utils.checkIfUserIsBlocked((profile?.blockedBy as string[]) || [], post.userId) || post.userId === profile?._id ? (
                PostUtils.checkPrivacy(
                  post,
                  profile as IUser,
                  followings.map((item) => item._id)
                ) ? (
                  <GalleryImage
                    key={`post-photo-${post._id}`}
                    post={post}
                    showCaption={true}
                    showDelete={false}
                    imgSrc={postImageUrl(post)}
                    onClick={() => {
                      setRightImageIndex(index + 1);
                      setLeftImageIndex(index);
                      setImageUrl(postImageUrl(post));
                      setShowImageModal(!showImageModal);
                    }}
                  />
                ) : null
              ) : null}
            </div>
          ))}
        </div>

        {loading && !posts.length ? (
          <div
            className="card-element"
            style={{
              height: '350px'
            }}
          ></div>
        ) : null}
        {!loading && !posts.length ? (
          <div className="empty-page" data-testid="empty-page">
            There are no photos to display
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Photos;
