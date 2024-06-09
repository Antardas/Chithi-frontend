import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// import Avatar from '~/Components/Avatar';
import { RootState, useAppDispatch } from '~/redux/store';
import PostWrapper from '../../ModalWrapper/PostWrapper';
import '~/Components/Post/PostModal/EditPost/EditPost.scss';
import { BiX } from 'react-icons/bi';
import ModalBoxContent from '~/Components/Post/PostModal/ModalBoxContent';
import { TbTrash } from 'react-icons/tb';
import { bgColors, feelingsList } from '~/services/utils/static.data';
import ModalBoxSelection from '~/Components/Post/PostModal/ModalBoxContent/ModalBoxSelection';
import Button from '~/Components/Button';
import { PostUtils } from '~/services/utils/post-utils.service';
import { IPostData, IPostDataEdit } from '~/types/post';
import { FaArrowLeft } from 'react-icons/fa';
import { addPostFeeling, closeModal, toggleGifModal } from '~/redux/reducers/modal/modal.reducer';
import Giphy from '~/Components/Giphy';
import { AxiosError, isAxiosError } from 'axios';
import { IError } from '~/types/axios';
import { ImageUtils } from '~/services/utils/image-utils.service';
import { postService } from '~/services/api/post/post.service';
import Spinner from '~/Components/Spinner';
import { Utils } from '~/services/utils/utils.service';

const maxNumberOfCharacter = 100;
const EditPost = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { gifModalIsOpen, feeling } = useSelector((state: RootState) => state.modal);
  const { image, gifUrl, post, privacy, bgColor, feelings, imgId, imgVersion, _id, videoId, videoVersion, video } = useSelector(
    (state: RootState) => state.post
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [hasVideo, setHasVideo] = useState<boolean>(false);
  const [postImage, setPostImage] = useState<string>('');
  const [allowedNumberOfChar, _setAllowedNumberOfChar] = useState('100/100');
  const [textAreaBackground, setTextAreaBackground] = useState<string>('#ffffff');
  const [disable, setDisable] = useState<boolean>(true);
  const [postData, setPostData] = useState<IPostDataEdit>({
    post: '',
    bgColor: textAreaBackground,
    privacy: '',
    feelings: '',
    gifUrl: '',
    profilePicture: '',
    image: '',
    imgId: '',
    imgVersion: '',
    video: '',
    videoId: '',
    videoVersion: ''
  });
  const [selectedPostImage, setSelectedPostImage] = useState<File | undefined>(undefined);
  const [selectedPostVideo, setSelectedPostVideo] = useState<File | undefined>(undefined);
  const [apiResponse, setApiResponse] = useState<string>('');
  const counterRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const selectBackground = (bgColor: string) => {
    PostUtils.selectBackgroundColor({
      bgColor,
      postData,

      setPostData,
      setTextAreaBackground
    });
  };
  //
  const postInputEditable = (event: React.ChangeEvent<HTMLDivElement>, textContent: string) => {
    const currentTextLength = event.target.textContent ? event.target.textContent.length : 0;
    const counter = maxNumberOfCharacter - currentTextLength;

    if (counterRef.current) {
      counterRef.current.textContent = `${counter}/100`;
    }
    setDisable(currentTextLength <= 0 && !postImage);
    PostUtils.postInputEditable({
      textContent,
      postData,
      setPostData
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentTextLength = (event.target as HTMLDivElement).textContent?.length;
    if (currentTextLength === maxNumberOfCharacter && event.keyCode !== 8) {
      event.preventDefault();
    }
  };

  const closePostModal = () => {
    PostUtils.closePostModal(dispatch);
  };

  const clearImage = () => {
    setSelectedPostVideo(undefined);
    setHasVideo(false);
    PostUtils.clearImage({
      postData,
      post,
      inputRef,
      dispatch,
      setPostImage,
      setPostData,
      setSelectedPostImage
    });
  };

  const updatePostWithMedia = async (file: File, type: 'image' | 'video') => {
    const result = (await ImageUtils.readAsBase64(file)) as string;
    if (type === 'image') {
      postData.image = result;
      postData.video = '';
    } else {
      postData.video = result;
      postData.image = '';
    }

    postData.gifUrl = '';
    postData.imgId = '';
    postData.imgVersion = '';
    postData.videoId = '';
    postData.videoVersion = '';

    const response = await PostUtils.updatePostWithMedia({
      dispatch,
      postData,
      postId: _id,
      setApiResponse,
      setLoading,
      mediaType: type
    });

    if (response && response.data.message) {
      closePostModal();
    }
  };
  const updateUserPost = async () => {
    const response = await PostUtils.updatePost({ dispatch, postData, postId: _id, setApiResponse, setLoading });
    if (response && response.data.message) {
      closePostModal();
    }
  };

  const updatePost = async () => {
    setLoading(true);
    setDisable(true);
    try {
      if (Object.keys(feeling).length) {
        postData.feelings = feeling.name;
      }

      if (postData.gifUrl || (postData.imgId && postData.imgVersion) || (postData.videoId && postData.videoVersion)) {
        postData.bgColor = '#ffffff';
      }

      postData.privacy = privacy || 'Public';
      // postData.gifUrl = gifUrl ?? '';
      postData.profilePicture = profile?.profilePicture ?? '';

      if (selectedPostImage) {
        await updatePostWithMedia(selectedPostImage, 'image');
      } else if (selectedPostVideo) {
        await updatePostWithMedia(selectedPostVideo, 'video');
      } else {
        await updateUserPost();
      }
      setHasVideo(false);
    } catch (error) {
      setHasVideo(false);
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
  };

  const getFeeling = useCallback(
    (name: string) => {
      const feeling = feelingsList.find((item) => item.name === name);
      dispatch(addPostFeeling(feeling));
    },
    [dispatch]
  );

  const postInputData = useCallback(() => {
    setTimeout(() => {
      if (imageInputRef.current) {
        postData.post = post;
        imageInputRef.current.textContent = post;
        setPostData(postData);
      }
    });
  }, [post, postData]);

  const editableFields = useCallback(() => {
    if (feelings) {
      getFeeling(feelings);
    }

    if (bgColor) {
      postData.bgColor = bgColor;
      setPostData(postData);
      setTextAreaBackground(bgColor);
      // setTimeout(() => {
      if (inputRef.current) {
        postData.post = post;
        inputRef.current.textContent = post;
        setPostData(postData);
        console.log(1);
      }
      // });
    }

    if (gifUrl) {
      postData.gifUrl = gifUrl;
      postData.image = '';
      postData.video = '';
      postData.imgId = '';
      postData.imgVersion = '';
      postData.videoId = '';
      postData.videoVersion = '';

      setPostImage(gifUrl);
      setHasVideo(false);
      postInputData();
    }

    if (imgId && imgVersion) {
      postData.imgId = imgId;
      postData.imgVersion = imgVersion;
      postData.videoId = '';
      postData.videoVersion = '';

      setHasVideo(false);
      const imgUrl = Utils.generateImageUrl(imgVersion, imgId);
      setPostImage(imgUrl);
      postInputData();
    }

    if (videoId && !imgId && !gifUrl) {
      postData.videoId = videoId;
      postData.videoVersion = videoVersion as string;
      postData.imgId = '';
      postData.imgVersion = '';
      const videoUrl = Utils.generateVideoUrl(videoVersion as string, videoId);
      setPostImage(videoUrl);
      setHasVideo(true);
      postInputData();
    }
  }, [bgColor, feelings, imgId, imgVersion, getFeeling, gifUrl, post, postData, postInputData, videoId, videoVersion]);

  useEffect(() => {
    if (image) {
      setPostImage(image);
      setHasVideo(false);
      PostUtils.postInputData({ imageInputRef, post, postData, setPostData });
    } else if (gifUrl) {
      PostUtils.postInputData({ imageInputRef, post, postData, setPostData });
      postData.image = '';
      postData.video = '';
      setSelectedPostVideo(undefined);
      setHasVideo(false);
      setSelectedPostImage(undefined);
      setPostImage(gifUrl);
    } else if (video) {
      setPostImage(video);
      setHasVideo(true);
      PostUtils.postInputData({ imageInputRef, post, postData, setPostData });
    }
    editableFields();
  }, [editableFields, gifUrl, image, postData, post, video]);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [imageInputRef]);

  useEffect(() => {
    if (imageInputRef && imageInputRef.current) {
      imageInputRef.current.focus();
    }
  }, [imageInputRef]);

  useEffect(() => {
    if (!loading && apiResponse === 'success') {
      dispatch(closeModal());
    }
    setDisable(postData.post.length <= 0 && !postImage);
  }, [loading, dispatch, apiResponse, postData, postImage]);

  useEffect(() => {
    PostUtils.positionCursor('editable');
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (imageInputRef.current && imageInputRef.current.textContent?.length) {
        if (counterRef.current && counterRef.current?.textContent !== undefined) {
          counterRef.current.textContent = `${maxNumberOfCharacter - imageInputRef.current.textContent?.length}/100`;
        }
      } else if (inputRef.current && inputRef.current.textContent?.length) {
        if (counterRef.current && counterRef.current?.textContent !== undefined) {
          counterRef.current.textContent = `${maxNumberOfCharacter - inputRef.current.textContent?.length}/100`;
        }
      }
    });
  }, []);

  return (
    <>
      <PostWrapper>
        <div></div>
        {!gifModalIsOpen ? (
          <div
            className="modal-box"
            style={{
              height: image || gifUrl  || hasVideo || imgId ? '700px' : 'auto'
            }}
          >
            {loading ? (
              <div className="modal-box-loading" data-testid="modal-box-loading">
                <span>Updating....</span>
                <Spinner />
              </div>
            ) : null}

            <div className="modal-box-header">
              <h2>Edit Post</h2>
              <button className="modal-box-header-cancel" onClick={closePostModal}>
                <BiX />
              </button>
            </div>
            <hr />
            <ModalBoxContent />

            {!postImage ? (
              <>
                <div
                  className="modal-box-form"
                  data-testid="modal-box-form"
                  style={{
                    background: `${textAreaBackground}`
                  }}
                >
                  <div
                    className="main"
                    style={{
                      margin: textAreaBackground !== '#ffffff' ? '0 auto' : ''
                    }}
                  >
                    <div className="flex-row">
                      <div
                        data-testid="editable"
                        data-name="post"
                        contentEditable={true}
                        id="editable"
                        data-placeholder="what's on your mind?..."
                        className={`editable flex-item ${textAreaBackground !== '#ffffff' ? 'textInputColor' : ''} ${postData.post.length === 0 && textAreaBackground !== '#ffffff' ? 'defaultInputTextColor' : ''}`}
                        onInput={(e: React.ChangeEvent<HTMLDivElement>) => {
                          postInputEditable(e, e.currentTarget?.textContent || '');
                        }}
                        onKeyDown={onKeyDown}
                        ref={inputRef}
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="modal-box-image-form">
                  <div
                    data-testid="post-editable"
                    data-name="post"
                    contentEditable={true}
                    data-placeholder="what's on your mind?..."
                    className="post-input flex-item"
                    id="editable"
                    onInput={(e: React.ChangeEvent<HTMLDivElement>) => {
                      // e.stopPropagation();
                      postInputEditable(e, e.currentTarget?.textContent || '');
                    }}
                    onKeyDown={onKeyDown}
                    ref={imageInputRef}
                  ></div>
                  <div className="image-display">
                    <div className="image-delete-btn" data-testid="image-delete-btn" onClick={clearImage}>
                      <TbTrash />
                    </div>
                    {hasVideo ? (
                      <div style={{ marginTop: '-40px' }}>
                        <video src={postImage} width={'100%'} controls>
                          {' '}
                        </video>
                      </div>
                    ) : (
                      <img src={postImage} alt="" data-testid="post-image" className="post-image" />
                    )}{' '}
                  </div>
                </div>
              </div>
            )}

            <div className="modal-box-bg-colors">
              <ul>
                {bgColors.map((color) => (
                  <li
                    data-testid="bg-colors"
                    key={color}
                    className={`${color === '#ffffff' ? 'whiteColorBorder' : ''}`}
                    style={{
                      backgroundColor: color
                    }}
                    onClick={() => {
                      PostUtils.positionCursor('editable');
                      selectBackground(color);
                    }}
                  ></li>
                ))}
              </ul>
            </div>

            <span className="char_count" data-testid="allowed-number" ref={counterRef}>
              {allowedNumberOfChar}
            </span>
            <ModalBoxSelection setSelectedPostImage={setSelectedPostImage} setSelectedPostVideo={setSelectedPostVideo} />

            <div className="modal-box-button" data-testid="edit-button">
              {/*

              TODO: add Handler


               */}
              <Button label="Update" className="post-button" disabled={disable} onClick={updatePost} />
            </div>
          </div>
        ) : (
          <div className="modal-giphy">
            <div className="modal-giphy-header">
              <Button
                label={<FaArrowLeft />}
                className="back-button"
                disabled={false}
                handleClick={() => {
                  dispatch(toggleGifModal(!gifModalIsOpen));
                }}
              />
              <h2>Choose a GIF</h2>
            </div>
            <hr />
            <Giphy />
          </div>
        )}
        {/* <div></div> */}
      </PostWrapper>
    </>
  );
};

export default EditPost;
