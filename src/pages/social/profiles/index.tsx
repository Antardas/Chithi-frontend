import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import BackgroundHeader from '~/Components/BackgroundHeader';
import { RootState, useAppDispatch } from '~/redux/store';
import { userService } from '~/services/api/user/user.service';
import { tabItems } from '~/services/utils/static.data';
import { Utils } from '~/services/utils/utils.service';
import { IUser } from '~/types/user';
import '~/pages/social/profiles/Profiles.scss';
import { ITabItems } from '~/types/utils';
import { ImageUtils } from '~/services/utils/image-utils.service';
import { imageService } from '~/services/api/image/image.service';
import { IImageData } from '~/types/image';
const Profiles = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { deleteDialogIsOpen, data } = useSelector((state: RootState) => state.modal);
  const [user, setUser] = useState<IUser | null>(null);
  const [rendered, setRendered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState<string>('');
  const [selectedProfileImage, setSelectedProfileImage] = useState('');
  const [bgUrl, setBgUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<IImageData[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [displayContent, setDisplayContent] = useState('timeline');
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [userProfileData, setUserProfileData] = useState<IUser | null>(null);
  const isRendered = useRef(false);
  const dispatch = useAppDispatch();
  const { username } = useParams();
  const [searchParams] = useSearchParams();

  const getUserProfileByUsername = useCallback(async () => {
    const id = searchParams.get('id'),
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
      if (newUser?.bgImageVersion && newUser?.bgImageVersion) {
        setBgUrl(Utils.generateImageUrl(newUser.bgImageVersion, newUser.bgImageId));
      }
      setLoading(false);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  }, [dispatch, searchParams, username]);

  const getUserImages = useCallback(async () => {
    const id = searchParams.get('id'),
      uId = searchParams.get('uId');
    if (!username || !id || !uId) return;
    try {
      const response = await imageService.getUserImages(id);
      setGalleryImages(response.data.data);
      setLoading(false);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  }, [dispatch, searchParams, username]);

  const changeTabContent = (data: string) => {
    setDisplayContent(data);
  };

  const selectedFileImage = async (data: string | File, type: string) => {
    setHasImage(!hasImage);
    if (data instanceof File) {
      if (type === 'background') {
        const isValidFile: boolean = ImageUtils.checkFile(data);

        if (!isValidFile) {
          return;
        }
        // const renamedFIle = ImageUtils.renameImage(data);
        // console.log(renamedFIle);

        const base64 = await ImageUtils.readAsBase64(data);
        setSelectedBackgroundImage(base64 as string);
      } else {
        const isValidFile: boolean = ImageUtils.checkFile(data);

        if (!isValidFile) {
          return;
        }
        const base64 = await ImageUtils.readAsBase64(data);
        setSelectedProfileImage(base64 as string);
      }
    } else {
      if (type === 'background') {
        setSelectedBackgroundImage(data as string);
      } else {
        setSelectedProfileImage(data as string);
      }
    }
  };

  const saveImage = async (type: string) => {
    // setLoading(true);
    try {
      if (type === 'background') {
        await imageService.addUserBackgroundImage(selectedBackgroundImage);
      } else {
        await imageService.addUserProfileImage(selectedProfileImage);
      }
      // setLoading(false);
      setHasError(false);
      setHasImage(false);
    } catch (error) {
      // setLoading(false);
      setHasError(true);
      Utils.addErrorNotification(error, dispatch);
    }
  };
  const cancelFileSelection = () => {
    setHasImage(false);
    setSelectedBackgroundImage('');
    setSelectedProfileImage('');
    setHasError(false);
  };
  const removeBackgroundImage = async (imgId: string, imgVersion: string) => {
    try {
      await imageService.deleteUserBackgroundImage(imgId);
      setBgUrl('');
    } catch (error) {
      setHasError(true);
      Utils.addErrorNotification(error, dispatch);
    }
  };
  // const tabItems = () => {};

  useEffect(() => {
    if (!isRendered.current) {
      getUserProfileByUsername();
      getUserImages();
    } else {
      isRendered.current = true;
    }
  }, [getUserProfileByUsername, getUserImages]);
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
