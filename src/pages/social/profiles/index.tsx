import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import BackgroundHeader from '~/Components/BackgroundHeader';
import { RootState, useAppDispatch } from '~/redux/store';
import { userService } from '~/services/api/user/user.service';
import { tabItems } from '~/services/utils/static.data';
import { Utils } from '~/services/utils/utils.service';
import { IUser } from '~/types/user';
import '~/pages/social/profiles/Profiles.scss'
const Profiles = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { deleteDialogIsOpen, data } = useSelector((state: RootState) => state.modal);
  const [user, setUser] = useState<IUser | null>(null);
  const [rendered, setRendered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState('');
  const [selectedProfileImage, setSelectedProfileImage] = useState('');
  const [bgUrl, setBgUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<
    [
      {
        imgId: string;
        imgVersion: string;
      }
    ]
  >([]);
  const [imageUrl, setImageUrl] = useState('');
  const [displayContent, setDisplayContent] = useState('timeline');
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);
  const dispatch = useAppDispatch();
  const { username } = useParams();
  const [searchParams] = useSearchParams();

  const getUserProfileByUsername = useCallback(async () => {
    const id = searchParams.get('uId'),
      uId = searchParams.get('uId');
    if (!username || !id || !uId) return;
    try {
      const response = await userService.getUserByUsername({
        username: username,
        id: id,
        uId: uId
      });
      const newUser = response.data.data.user;
      setUser(newUser);
      // setUserProfileData(response.data);
      setBgUrl(Utils.generateImageUrl(newUser.bgImageVersion, newUser.bgImageId));
      setLoading(false);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  }, [dispatch, searchParams, username]);

  const changeTabContent = () => {};
  const selectedFileImage = () => {};
  const saveImage = () => {};
  const cancelFileSelection = () => {};
  const removeBackgroundImage = () => {};
  // const tabItems = () => {};

  useEffect(() => {
    getUserProfileByUsername();
  }, [])
  return (
    <>
      <div className="profile-wrapper">
        <div className="profile-wrapper-container">
          <div className="profile-header">
            {user ? (
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
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profiles;
