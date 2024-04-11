import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// import Avatar from '~/Components/Avatar';
import { RootState, useAppDispatch } from '~/redux/store';
import PostWrapper from '../../ModalWrapper/PostWrapper';
import '~/Components/Post/PostModal/AddPost/AddPost.scss';
import { BiX } from 'react-icons/bi';
import ModalBoxContent from '~/Components/Post/PostModal/ModalBoxContent';
import { TbTrash } from 'react-icons/tb';
import { bgColors } from '~/services/utils/static.data';
import ModalBoxSelection from '~/Components/Post/PostModal/ModalBoxContent/ModalBoxSelection';
import Button from '~/Components/Button';
import { PostUtils } from '~/services/utils/post-utils.service';
import { IPostData } from '~/types/post';
import { FaArrowLeft } from 'react-icons/fa';
import { closeModal, toggleGifModal } from '~/redux/reducers/modal/modal.reducer';
import Giphy from '~/Components/Giphy';
import { AxiosError, isAxiosError } from 'axios';
import { IError } from '~/types/axios';
import { ImageUtils } from '~/services/utils/image-utils.service';
import { postService } from '~/services/api/post/post.service';
import Spinner from '~/Components/Spinner';

const maxNumberOfCharacter = 100;
const AddPost = ({ selectedImage }: AddPostProps) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { gifModalIsOpen, feeling } = useSelector((state: RootState) => state.modal);
  const { image, gifUrl, post, privacy } = useSelector((state: RootState) => state.post);
  const [loading, setLoading] = useState<boolean>(false);
  const [postImage, setPostImage] = useState<string>('');
  const [allowedNumberOfChar, _setAllowedNumberOfChar] = useState('100/100');
  const [textAreaBackground, setTextAreaBackground] = useState<string>('#ffffff');
  const [disable, setDisable] = useState<boolean>(true);
  const [postData, setPostData] = useState<IPostData>({
    post: '',
    bgColor: textAreaBackground,
    privacy: '',
    feelings: '',
    gifUrl: '',
    profilePicture: '',
    image: ''
  });
  const [selectedPostImage, setSelectedPostImage] = useState<File | undefined>(selectedImage);
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

  const createPost = async () => {
    setLoading(true);
    setDisable(true);
    try {
      if (Object.keys(feeling).length) {
        postData.feelings = feeling.name;
      }
      postData.privacy = privacy || 'Public';
      postData.gifUrl = gifUrl ?? '';
      postData.profilePicture = profile?.profilePicture ?? '';

      if (selectedPostImage) {
        const result = await ImageUtils.readAsBase64(selectedPostImage);

        const response = await PostUtils.sendPostWithImage({
          dispatch,
          file: result as string,
          postData,
          imageInputRef,
          setApiResponse,
          setLoading
        });

        if (response && response?.data.message) {
          PostUtils.closePostModal(dispatch);
        }
      } else {
        const response = await postService.createPost(postData);
        if (response && response?.data.message) {
          setApiResponse('success');
          setLoading(false);
          PostUtils.closePostModal(dispatch);
        }
      }
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
  };

  useEffect(() => {
    if (image) {
      setPostImage(image);
      PostUtils.postInputData({ imageInputRef, post: '', postData, setPostData });
    } else if (gifUrl) {
      PostUtils.postInputData({ imageInputRef, post: '', postData, setPostData });
      setPostImage(gifUrl);
    }
  }, [image, gifUrl, postData]);

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

  return (
    <>
      <PostWrapper>
        <div></div>
        {!gifModalIsOpen ? (
          <div
            className="modal-box"
            style={{
              height: selectedImage || image || gifUrl || postData.gifUrl || postData.image ? '700px' : 'auto'
            }}
          >
            {loading ? (
              <div className="modal-box-loading" data-testid="modal-box-loading">
                <span>Posting....</span>
                <Spinner />
              </div>
            ) : null}

            <div className="modal-box-header">
              <h2>Create Post</h2>
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
                    <img src={postImage} alt="" data-testid="post-image" className="post-image" />
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
            <ModalBoxSelection setSelectedPostImage={setSelectedPostImage} />

            <div className="modal-box-button" data-testid="post-button">
              {/*

              TODO: add Handler


               */}
              <Button label="Post" className="post-button" disabled={disable} onClick={createPost} />
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

export default AddPost;

interface AddPostProps {
  selectedImage?: File;
}
