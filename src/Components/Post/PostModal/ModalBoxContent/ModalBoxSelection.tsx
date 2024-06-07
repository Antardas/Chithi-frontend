import React, { useRef } from 'react';
import photo from '~/assets/images/photo.png';
import gif from '~/assets/images/gif.png';
import feeling from '~/assets/images/feeling.png';
import video from '~/assets/images/video.png';
import Input from '~/Components/Input';
import Feelings from '~/Components/Feeling';
import useDetectOutsideClick from '~/hooks/useDetectOutsideClick';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '~/redux/store';
import { ImageUtils } from '~/services/utils/image-utils.service';
import { SetState } from '~/types/utils';
import { toggleGifModal } from '~/redux/reducers/modal/modal.reducer';
import { Utils } from '~/services/utils/utils.service';
interface ModalBoxSelectionProps {
  setSelectedPostImage: SetState<File | undefined>;
  setSelectedPostVideo: SetState<File | undefined>;
}
const ModalBoxSelection = ({ setSelectedPostImage, setSelectedPostVideo }: ModalBoxSelectionProps) => {
  const { feelingsIsOpen, gifModalIsOpen } = useSelector((state: RootState) => state.modal);
  const { post } = useSelector((state: RootState) => state.post);
  const feelingRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [toggleFeelings, setToggleFeelings] = useDetectOutsideClick(feelingRef, feelingsIsOpen);
  const dispatch = useAppDispatch();

  const fileInputClick = () => {
    fileInputRef.current?.click();
  };

  const videoInputClick = () => {
    videoInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ImageUtils.addFileToRedux(e, post, setSelectedPostImage, dispatch, 'image');
  };
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      ImageUtils.addFileToRedux(e, post, setSelectedPostVideo, dispatch, 'video');
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };
  return (
    <>
      {toggleFeelings ? (
        <div ref={feelingRef}>
          <Feelings />
        </div>
      ) : null}
      <div className="modal-box-selection" data-testid="modal-box-selection">
        <ul className="post-form-list" data-testid="list-item">
          <li className="post-form-list-item image-select" onClick={fileInputClick}>
            <Input
              name="image"
              ref={fileInputRef}
              id="file-image-input"
              type="file"
              className="file-input"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              onChange={handleChange}
            />
            <img src={photo} alt="" /> Photo
          </li>
          <li
            className="post-form-list-item"
            onClick={() => {
              dispatch(toggleGifModal(!gifModalIsOpen));
            }}
          >
            <img src={gif} alt="" /> Gif
          </li>
          <li
            className="post-form-list-item"
            onClick={() => {
              setToggleFeelings(!toggleFeelings);
            }}
          >
            <img src={feeling} alt="" /> Feeling
          </li>
          <li className="post-form-list-item image-select" onClick={videoInputClick}>
            <Input
              name="video"
              ref={videoInputRef}
              id="file-image-input"
              type="file"
              className="file-input"
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
    </>
  );
};

export default ModalBoxSelection;
