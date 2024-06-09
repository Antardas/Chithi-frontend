import React from 'react';
import { useAppDispatch } from '~/redux/store';
import { userService } from '~/services/api/user/user.service';
import { Utils } from '~/services/utils/utils.service';
import { IBasicInfo, IUser } from '~/types/user';
import BasicInfoSkeleton from './BasicInfoSkeleton';
import { SetState } from '~/types/utils';
import InfoDisplay from './InfoDisplay';

const noBasicInfo = {
  quoteMsg: 'No information',
  workMsg: 'No information',
  schoolMsg: 'No information',
  locationMsg: 'No information'
};
const noSocialInfo = {
  instagramMsg: '',
  twitterMsg: '',
  facebookMsg: '',
  youtubeMsg: ''
};
const editableSocialInputs = {
  instagram: '',
  twitter: '',
  facebook: '',
  youtube: ''
};
const basicInfoPlaceholder = {
  quotePlaceholder: 'Add your quote',
  workPlaceholder: 'Add company name',
  schoolPlaceholder: 'Add school name',
  locationPlaceholder: 'Add city and country names'
};
const socialLinksPlaceholder = {
  instagramPlaceholder: '',
  twitterPlaceholder: '',
  facebookPlaceholder: '',
  youtubePlaceholder: ''
};

const BasicInfo = ({ editableInputs, username, profile, loading, setEditableInputs }: Props) => {
  const dispatch = useAppDispatch();

  const updateBasicInfo = async () => {
    try {
      const response = await userService.updateBasicInfo(editableInputs);
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
          title="Basic Info"
          type="basic"
          isCurrentUser={username === profile?.username}
          noBasicInfo={noBasicInfo}
          noSocialInfo={noSocialInfo}
          basicInfoPlaceholder={basicInfoPlaceholder}
          socialLinksPlaceholder={socialLinksPlaceholder}
          editableInputs={editableInputs}
          editableSocialInputs={editableSocialInputs}
          loading={loading}
          setEditableInputs={setEditableInputs}
          updateInfo={updateBasicInfo}
          setEditableSocialInputs={() => {}}
        />
      )}
    </>
  );
};

export default BasicInfo;

interface Props {
  username: string;
  profile: IUser;
  loading: boolean;
  editableInputs: IBasicInfo;
  setEditableInputs: SetState<IBasicInfo>;
}
