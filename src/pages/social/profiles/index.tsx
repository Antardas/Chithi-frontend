import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import BackgroundHeader from '~/Components/BackgroundHeader';
import { RootState, useAppDispatch } from '~/redux/store';
import { IUser } from '~/types/user';

const Profiles = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { deleteDialogIsOpen, data } = useSelector((state: RootState) => state.modal);
  const [user, setUser] = useState<IUser>(null);
  const [rendered, setRendered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState('');
  const [selectedProfileImage, setSelectedProfileImage] = useState('');
  const [bgUrl, setBgUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [displayContent, setDisplayContent] = useState('timeline');
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);
  const dispatch = useAppDispatch();
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  return (
    <>
      <div className="profile-wrapper">
        <div className="profile-wrapper-container">
          <div className="profile-header">
            <BackgroundHeader
              user={user}
              loading={loading}
              hasImage={hasImage}
              hasError={hasError}
              url={bgUrl}
              onClick={changeTabContent}
              selectedFileImage={selectedFileImage}
              saveImage={saveImage}
              cancelFileSelection={cancelFileSelection}
              removeBackgroundImage={removeBackgroundImage}
              tabItems={tabItems(username === profile?.username, username === profile?.username)}
              tab={displayContent}
              hideSettings={username === profile?.username}
              galleryImages={galleryImages}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profiles;
