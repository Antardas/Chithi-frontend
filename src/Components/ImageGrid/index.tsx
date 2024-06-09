import React from 'react';
import ReactionWrapper from '../Post/ModalWrapper/ReactionWrapper';
import { Utils } from '~/services/utils/utils.service';
import { IImageData } from '~/types/image';
import '~/Components/ImageGrid/ImageGrid.scss'
const ImageGrid = ({ images, closeModal, selectedImage }: ImageGridProps) => {
  return (
    <ReactionWrapper closeModal={closeModal}>
      <div className="modal-image-header">
        <h2>Select Photo</h2>
      </div>
      <div className="modal-image-container">
        {images.map((data, index) => (
          <img
            key={index}
            className="grid-image"
            alt=""
            src={`${Utils.generateImageUrl(data.imgVersion, data.imgId)}`}
            onClick={() => {
              selectedImage(Utils.generateImageUrl(data.imgVersion, data.imgId));
              closeModal();
            }}
          />
        ))}
      </div>
    </ReactionWrapper>
  );
};

export default ImageGrid;

interface ImageGridProps {
  images: IImageData[]
  closeModal: () => void;
  selectedImage: (url: string) => void;
}
