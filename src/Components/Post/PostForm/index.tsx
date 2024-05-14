import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Avatar from '~/Components/Avatar';
import Input from '~/Components/Input';
import '~/Components/Post/PostForm/PostForm.scss';
import { RootState, useAppDispatch } from '~/redux/store';
import photo from '~/assets/images/photo.png';
import gif from '~/assets/images/gif.png';
import feeling from '~/assets/images/feeling.png';
import video from '~/assets/images/video.png';
import { openModal, toggleFeelingModal, toggleGifModal, toggleImageModal, toggleVideoModal } from '~/redux/reducers/modal/modal.reducer';
import AddPost from '~/Components/Post/PostModal/AddPost';
import { ImageUtils } from '~/services/utils/image-utils.service';
import EditPost from '../PostModal/EditPost';

const PostForm = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { type, isOpen, openFileDialog, gifModalIsOpen, feelingsIsOpen,videoModalIsOpen } = useSelector((state: RootState) => state.modal);
  const [selectedPostImage, setSelectedPostImage] = useState<File>();
  const [selectedPostVideo, setSelectedPostVideo] = useState<File>();

  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null); // TODO: change the file to Image
  const videoInputRef = useRef<HTMLInputElement>(null);
  const openPostModal = () => {
    dispatch(
      openModal({
        type: 'add',
        data: null
      })
    );
  };
  const openImageModal = () => {
    fileInputRef.current?.click();
    openPostModal();
    dispatch(toggleImageModal(!openFileDialog));
  };

	const openVideoModal = () => {
		videoInputRef.current?.click()
    openPostModal();
    dispatch(toggleVideoModal(!videoModalIsOpen));
	};
	
  const openGifModal = () => {
    openPostModal();
    dispatch(toggleGifModal(!gifModalIsOpen));
  };
  const openFeelingModal = () => {
    openPostModal();
    dispatch(toggleFeelingModal(!feelingsIsOpen));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ImageUtils.addFileToRedux(e, '', setSelectedPostImage, dispatch);
	};
	
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ImageUtils.addFileToRedux(e, '', setSelectedPostVideo, dispatch);
  };
  return (
    <div>
      <div className="post-form" data-testid="post-form">
        <div className="post-form-row">
          <div className="post-form-header">
            <h4 className="post-form-title">Create Post</h4>
          </div>
          <div className="post-form-body">
            <div className="post-form-input-body" data-testid="input-body" onClick={openPostModal}>
              <Avatar
                name={profile?.username ?? ''}
                bgColor={profile?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={profile?.profilePicture ?? ''}
              />
              <div className="post-form-input" data-placeholder="Write something here..."></div>
            </div>
            <hr />
            <ul className="post-form-list" data-testid="list-item">
              <li className="post-form-list-item image-select" onClick={openImageModal}>
                <Input
                  id="post-image"
                  name="image"
                  type="file"
                  className="file-input"
                  ref={fileInputRef}
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  onChange={handleImageFileChange}
                />
                <img src={photo} alt="" /> Photo
              </li>
              <li className="post-form-list-item" onClick={openGifModal}>
                <img src={gif} alt="" /> Gif
              </li>
              <li className="post-form-list-item" onClick={openFeelingModal}>
                <img src={feeling} alt="" /> Feeling
              </li>
              
							{/**  
							 * Video Input Section
							 * 
							 * 
							 */}
							<li className="post-form-list-item image-select" onClick={openImageModal}>
                <Input
                  id="post-video"
                  name="image"
									type="file"
									accept="video/mp4,video/x-m4v,video/*"
									className="file-input"
                  ref={videoInputRef}
                  onClick={() => {
                    if (videoInputRef.current) {
                      videoInputRef.current.value = '';
                    }
                  }}
                  onChange={handleVideoFileChange}
                />
                <img src={video} alt="" /> Video
              </li>
            </ul>
          </div>
        </div>
      </div>
      {isOpen && type === 'add' ? <AddPost selectedImage={selectedPostImage} /> : null}
      {isOpen && type === 'edit' ? <EditPost /> : null}
    </div>
  );
};

export default PostForm;
