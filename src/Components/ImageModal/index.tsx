import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

import '~/Components/ImageModal/ImageModal.scss';

const ImageModal = ({ image, onCancel, onClickLeft, onClickRight, showArrow, lastItemRight, lastItemLeft }: ImageModalProps) => {
  return (
    <div className="image-modal-container" data-testid="image-modal">
      <div className="image-modal-icon" onClick={onCancel}>
        <FaTimes />
      </div>
      {showArrow ? (
        <div
          className={'image-modal-icon-left'}
          onClick={onClickLeft}
          style={{ pointerEvents: `${lastItemLeft ? 'none' : 'all'}`, color: `${lastItemLeft ? '#bdbdbd' : ''}` }}
        >
          <FaArrowLeft />
        </div>
      ) : null}
      <div className="image-modal-overlay">
        <div className="image-modal-box">
          <img className="modal-image" alt="" src={`${image}`} />
        </div>
      </div>
      {showArrow ? (
        <div
          className={'image-modal-icon-right'}
          onClick={onClickRight}
          style={{ pointerEvents: `${lastItemRight ? 'none' : 'all'}`, color: `${lastItemRight ? '#bdbdbd' : ''}` }}
        >
          <FaArrowRight />
        </div>
      ) : null}
    </div>
  );
};

export interface ImageModalProps {
  image: string;
  onCancel: () => void;
  onClickRight?: () => void;
  onClickLeft?: () => void;
  showArrow: boolean;
  lastItemRight?: boolean;
  lastItemLeft?: boolean;
}

export default ImageModal;
