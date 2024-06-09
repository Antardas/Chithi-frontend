import React from 'react';
import { useAppDispatch } from '~/redux/store';
import InfoDisplay from './InfoDisplay';
import { Utils } from '~/services/utils/utils.service';
import { userService } from '~/services/api/user/user.service';
import { SetState } from '~/types/utils';
import BasicInfoSkeleton from './BasicInfoSkeleton';
import { ISocialLinks, IUser } from '~/types/user';
const noBasicInfo = {
  quoteMsg: '',
  workMsg: '',
  schoolMsg: '',
  locationMsg: ''
};
const noSocialInfo = {
  instagramMsg: 'No link available',
  twitterMsg: 'No link available',
  facebookMsg: 'No link available',
  youtubeMsg: 'No link available'
};
const editableInputs = {
  quote: '',
  work: '',
  school: '',
  location: ''
};

const basicInfoPlaceholder = {
  quotePlaceholder: '',
  workPlaceholder: '',
  schoolPlaceholder: '',
  locationPlaceholder: ''
};
const socialLinksPlaceholder = {
  instagramPlaceholder: 'Add your Instagram account link',
  twitterPlaceholder: 'Add your Twitter account link',
  facebookPlaceholder: 'Add your Facebook account link',
  youtubePlaceholder: 'Add your YouTube account link'
};
const SocialLinks = ({ editableSocialInputs, loading, profile, setEditableSocialInputs, username }: Props) => {
  const dispatch = useAppDispatch();
  const editableSocialLinks = editableSocialInputs ?? {
    instagram: '',
    twitter: '',
    facebook: '',
    youtube: ''
  };

  const updateSocialLinks = async () => {
    try {
      console.log(editableSocialInputs);
      const response = await userService.updateSocialLinks(editableSocialInputs);
      Utils.dispatchNotification(response.data.message, 'success', dispatch);
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  return (
    <>
      {loading ? (
        <BasicInfoSkeleton />
      ) : (
        <InfoDisplay
          title="Social Links"
          type="social"
          isCurrentUser={username === profile?.username}
          noBasicInfo={noBasicInfo}
          noSocialInfo={noSocialInfo}
          basicInfoPlaceholder={basicInfoPlaceholder}
          socialLinksPlaceholder={socialLinksPlaceholder}
          editableInputs={editableInputs}
          editableSocialInputs={editableSocialLinks}
          loading={loading}
          setEditableSocialInputs={setEditableSocialInputs}
          updateInfo={updateSocialLinks}
          setEditableInputs={() => {}}
        />
      )}
    </>
  );
};

export default SocialLinks;

interface Props {
  username: string;
  profile: IUser;
  loading: boolean;
  editableSocialInputs: ISocialLinks;
  setEditableSocialInputs: SetState<ISocialLinks>;
}
