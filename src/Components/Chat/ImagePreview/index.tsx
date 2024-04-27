import React from 'react';
import { FaTimes } from 'react-icons/fa';
import '~/Components/Chat/ImagePreview/ImagePreview.scss';
const ImagePreview = ({ image, onRemoveImage }: Props) => {
  return (
    <div className="image-preview-container" data-testid="image-preview">
      <div className="image-preview">
        <img className="img" src={image} alt="" />
        <FaTimes className="icon" onClick={onRemoveImage} />
      </div>
    </div>
  );
};

export default ImagePreview;

interface Props {
  image: string;
  onRemoveImage: () => void;
}
