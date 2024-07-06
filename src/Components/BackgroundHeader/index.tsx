import React, { useEffect, useRef, useState } from 'react';
import Spinner from '../Spinner';
import Button from '../Button';
import Avatar from '../Avatar';
import Input from '../Input';
import { FaCamera } from 'react-icons/fa';
import { IUser } from '~/types/user';
import ImageGrid from '../ImageGrid';
import { ITabItems } from '~/types/utils';
import '~/Components/BackgroundHeader/BackgroundHeader.scss';
import BackgroundHeaderSkeleton from './BackgroundHeaderSkeleton';
import { IImageData } from '~/types/image';
import { ImageUtils } from '~/services/utils/image-utils.service';
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

  const validateAndProcessFile = async (file: File): Promise<string | null> => {
    const isValidFile: boolean = ImageUtils.checkFile(file, 'image');

    if (!isValidFile) {
      return null;
    }

    try {
      const base64 = await ImageUtils.readAsBase64(file);
      return base64 as string;
    } catch (error) {
      console.error('Error converting file to base64', error);
      return null;
    }
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
          selectedImage={(url) => {
            setSelectedBackground(url);
            selectedFileImage(url, 'background');
          }}
        />
      )}

      {loading ? (
        <BackgroundHeaderSkeleton tabItems={tabItems} />
      ) : (
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
          <div
            data-testid="profile-banner-image"
            className="profile-banner-image"
            style={{
              background: `${!selectedBackground ? user.avatarColor : ''}`
            }}
          >
            {url && hideSettings && !hasImage ? (
              <div className="delete-btn" data-testid="delete-btn">
                <Button
                  label="Remove"
                  className="remove"
                  disabled={false}
                  onClick={() => {
                    removeBackgroundImage(user.bgImageId, user.bgImageVersion);
                  }}
                />
              </div>
            ) : null}
            {!selectedBackground && !url ? <h3>Add a background image</h3> : <img src={`${selectedBackground || url}`} alt="" />}
          </div>
          <div className="profile-banner-data">
            <div
              data-testid="profile-pic"
              className="profile-pic"
              style={{
                width: `${user.profilePicture ? '180px' : ''}`
              }}
            >
              <Avatar
                name={user?.username as string}
                bgColor={user?.avatarColor}
                textColor="#ffffff"
                size={180}
                avatarSrc={selectedProfileImage || user?.profilePicture}
              />

              {hideSettings ? (
                <div className="profile-pic-select" data-testid="profile-pic-select">
                  <Input
                    type="file"
                    className="inputFile"
                    name=""
                    id=""
                    ref={profileImageRef}
                    onClick={(event) => {
                      if (profileImageRef.current) {
                        profileImageRef.current.value = '';
                      }
                    }}
                    onChange={(event) => {
                      if (event.target.files && event.target.files.length) {
                        validateAndProcessFile(event.target.files[0]).then((data) => {
                          if (data && event.target.files && event.target.files[0]) {
                            setSelectedProfileImage(URL.createObjectURL(event.target.files[0]));
                            selectedFileImage(data, 'profile');
                          }
                        });
                      }
                    }}
                  />
                  <label
                    onClick={() => {
                      profileFileInputClicked();
                    }}
                  >
                    <FaCamera className="camera" />
                  </label>
                </div>
              ) : null}
            </div>
            <div className="profile-name">{user.username}</div>
            {hideSettings ? (
              <div className="profile-select-image">
                <Input
                  type="file"
                  className="inputFile"
                  id=""
                  name=""
                  ref={backgroundFileRef}
                  onClick={(event) => {
                    if (backgroundFileRef.current) {
                      backgroundFileRef.current.value = '';
                    }
                  }}
                  onChange={(event) => {
                    if (event.target.files && event.target.files.length) {
                      validateAndProcessFile(event.target.files[0]).then((data) => {
                        if (data && event.target.files && event.target.files[0]) {
                          setSelectedBackground(URL.createObjectURL(event.target.files[0]));
                          selectedFileImage(data, 'background');
                        }
                      });
                    }
                  }}
                />
                <label data-testid="add-cover-photo" onClick={() => onAddProfileClick()}>
                  <FaCamera className="camera" /> <span>Add Cover Photo</span>
                </label>
                {isActive ? <BackgroundSelectDropdown /> : null}
              </div>
            ) : null}
          </div>
          <div className="profile-banner-items">
            <ul className="banner-nav">
              {tabItems.map((item: ITabItems) => {
                return (
                  <div data-testid="tab-elements" key={item.key}>
                    {item.show ? (
                      <li className="banner-nav-item">
                        <div
                          className={`banner-nav-item-name ${tab.toLowerCase() === item.key.toLowerCase() ? 'active' : ''}`}
                          onClick={() => {
                            onClick(item.key);
                          }}
                        >
                          {item.icon}
                          <p className="title">{item.key}</p>
                        </div>
                      </li>
                    ) : null}
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default BackgroundHeader;

interface BackgroundHeaderProps {
  user: IUser;
  loading: boolean;
  url: string;
  onClick: (tab: string) => void;
  tab: string;
  hasImage: boolean;
  tabItems: ITabItems[];
  hasError: boolean;
  hideSettings: boolean;
  selectedFileImage: (url: string, type: 'background' | 'profile') => void;
  saveImage: (type: 'background' | 'profile') => void;
  cancelFileSelection: () => void;
  removeBackgroundImage: (imgId: string, imgVersion: string) => void;
  galleryImages: IImageData[];
}
