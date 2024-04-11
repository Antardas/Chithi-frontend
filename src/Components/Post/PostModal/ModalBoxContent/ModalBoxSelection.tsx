import React, { useRef } from 'react';
import photo from '~/assets/images/photo.png';
import gif from '~/assets/images/gif.png';
import feeling from '~/assets/images/feeling.png';
import Input from '~/Components/Input';
import Feelings from '~/Components/Feeling';
import useDetectOutsideClick from '~/hooks/useDetectOutsideClick';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '~/redux/store';
import { ImageUtils } from '~/services/utils/image-utils.service';
import { SetState } from '~/types/utils';
import { toggleGifModal } from '~/redux/reducers/modal/modal.reducer';
interface ModalBoxSelectionProps {
  setSelectedPostImage: SetState<File | undefined>;
}
const ModalBoxSelection = ({ setSelectedPostImage }: ModalBoxSelectionProps) => {
  const { feelingsIsOpen, gifModalIsOpen  } = useSelector((state: RootState) => state.modal);
  const { post } = useSelector((state: RootState) => state.post);
  const feelingRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toggleFeelings, setToggleFeelings] = useDetectOutsideClick(feelingRef, feelingsIsOpen);
  const dispatch = useAppDispatch();

  const fileInputClick = () => {
    console.log('fileInputClick');

    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ImageUtils.addFileToRedux(e, post, setSelectedPostImage, dispatch);
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
          <li className="post-form-list-item" onClick={() => {
                  dispatch(toggleGifModal(!gifModalIsOpen));
                }}>
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
        </ul>
      </div>
    </>
  );
};

export default ModalBoxSelection;
