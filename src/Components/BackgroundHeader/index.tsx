import React, { useEffect, useRef, useState } from 'react';
import Spinner from '../Spinner';
import Button from '../Button';
import Avatar from '../Avatar';
import Input from '../Input';
import { FaCamera } from 'react-icons/fa';
import { IUser } from '~/types/user';
import ImageGrid from '../ImageGrid';

const BackgroundHeader = ({
  user,
  loading,
  url,
  onClick,
  tab,
  hasImage,
  tabItems,
  hasError,
  hideSettings,
  selectedFileImage,
  saveImage,
  cancelFileSelection,
  removeBackgroundImage,
  galleryImages
}: BackgroundHeaderProps) => {
  const [selectedBackground, setSelectedBackground] = useState<string>('');
  const [selectedProfileImage, setSelectedProfileImage] = useState<string>('');
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [showImagesModal, setShowImagesModal] = useState<boolean>(false);
  const backgroundFileRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const backgroundFileInputClicked = () => {
    if (backgroundFileRef.current) {
      backgroundFileRef.current.click();
    }
  };

  const profileFileInputClicked = () => {
    if (profileImageRef.current) {
      profileImageRef.current.click();
    }
  };

  const hideSaveChangesContainer = () => {
    setSelectedBackground('');
    setSelectedProfileImage('');
    setShowSpinner(false);
  };
  const onAddProfileClick = () => setIsActive(!isActive);

  const BackgroundSelectDropdown = () => {
    return (
      <nav className="menu" data-testid="menu">
        <ul>
          {galleryImages.length ? (
            <li
              onClick={() => {
                setShowImagesModal(true);
                setIsActive(false);
              }}
            >
              <div className="item">Select</div>
            </li>
          ) : null}
          <li
            onClick={() => {
              backgroundFileInputClicked();
              setIsActive(false);
              setShowImagesModal(false);
            }}
          >
            <div className="item">Upload</div>
          </li>
        </ul>
      </nav>
    );
  };

  useEffect(() => {
    if (!hasImage) {
      setShowSpinner(false);
    }
  }, [hasImage]);
  return (
    <>
      {showImagesModal && (
        <ImageGrid
          images={galleryImages}
          closeModal={() => setShowImagesModal(false)}
          selectedImage={(event) => {
            setSelectedBackground(event);
            selectedFileImage(event, 'background');
          }}
        />
      )}

      <div className="profile-banner" data-testid="profile-banner">
        {hasImage ? (
          <div className="save-changes-container" data-testid="save-changes-container">
            <div className="save-changes-box">
              <div className="spinner-container">{showSpinner && !hasError ? <Spinner bgColor="white" /> : null}</div>
              <div className="save-changes-buttons">
                <div className="save-changes-buttons-bg">
                  <Button
                    label="Cancel"
                    className="cancel change-btn"
                    disabled={false}
                    onClick={() => {
                      setShowSpinner(false);
                      cancelFileSelection();
                      hideSaveChangesContainer();
                    }}
                  />
                  <Button
                    label="Save Changes"
                    className="save change-btn"
                    disabled={false}
                    onClick={() => {
                      setShowSpinner(true);
                      const type = selectedBackground ? 'background' : 'profile';
                      saveImage(type);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div data-testid="profile-banner-image" className="profile-banner-image">
          <div className="delete-btn" data-testid="delete-btn">
            <Button label="Remove" className="remove" disabled={false} />
          </div>
          <h3>Add a background image</h3>
          <img src="" alt="" />
        </div>
        <div className="profile-banner-data">
          <div data-testid="profile-pic" className="profile-pic">
            <Avatar
              name={user?.username as string}
              bgColor={user?.avatarColor}
              textColor="#ffffff"
              size={180}
              avatarSrc={selectedProfileImage || user?.profilePicture}
            />
            <div className="profile-pic-select" data-testid="profile-pic-select">
              <Input type="file" className="inputFile" />
              <label>
                <FaCamera className="camera" />
              </label>
            </div>
          </div>
          <div className="profile-name">Danny</div>
          <div className="profile-select-image">
            <Input type="file" className="inputFile" />
            <label data-testid="add-cover-photo">
              <FaCamera className="camera" /> <span>Add Cover Photo</span>
            </label>
            Background select dropdown
          </div>
        </div>
        <div className="profile-banner-items">
          <ul className="banner-nav">
            <div data-testid="tab-elements">
              <li className="banner-nav-item">
                <div className="banner-nav-item-name">
                  Icon
                  <p className="title">Item</p>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
};

export default BackgroundHeader;

interface BackgroundHeaderProps {
  user: IUser;
  loading: boolean;
  url: string;
  onClick: () => void;
  tab: string;
  hasImage: boolean;
  tabItems: [];
  hasError: boolean;
  hideSettings: boolean;
  selectedFileImage: (url: string, type: string) => void;
  saveImage: (type: 'background' | 'profile') => void;
  cancelFileSelection: () => void;
  removeBackgroundImage: () => void;
  galleryImages: [
    {
      imgId: string;
      imgVersion: string;
    }
  ];
}
