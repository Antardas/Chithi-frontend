import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Avatar from '~/Components/Avatar';
import { RootState } from '~/redux/store';
import feelingImage from '~/assets/images/feeling.png';
import SelectDropdown from '~/Components/SelectDropdown';
import { IDropdownOption } from '~/types/post';
import { FaGlobe } from 'react-icons/fa';
import useDetectOutsideClick from '~/hooks/useDetectOutsideClick';
import { privacyList } from '~/services/utils/static.data';
const ModalBoxContent = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { privacy } = useSelector((state: RootState) => state.post);
  const { feeling } = useSelector((state: RootState) => state.modal);
  const privacyRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<IDropdownOption>({
    topText: 'Public',
    subText: 'Anyone on Chithi',
    icon: <FaGlobe />
  });

  const [togglePrivacy, setTogglePrivacy] = useDetectOutsideClick(privacyRef, false);

  const displayPostPrivacy = useCallback(() => {
    if (privacy) {
      const postPrivacy = privacyList.find((data) => data.topText === privacy);
      if (postPrivacy) {
        setSelectedItem(postPrivacy);
      }
    }
  }, []);

  useEffect(() => {
    displayPostPrivacy();
  }, [displayPostPrivacy]);

  return (
    <div className="modal-box-content" data-testid="modal-box-content">
      <div className="user-post-image" data-testid="box-avatar">
        <Avatar
          name={profile?.username ?? ''}
          bgColor={profile?.avatarColor}
          textColor="#ffffff"
          size={40}
          avatarSrc={profile?.profilePicture ?? ''}
        />
      </div>
      <div className="modal-box-info">
        <h5 className="inline-title-display" data-testid="box-username">
          {profile?.username}
        </h5>
        {feeling?.name ? (
          <p className="inline-display" data-testid="box-feeling">
            is feeling <img className="feeling-icon" src={feeling.image} alt="" /> <span>{feeling.name}</span>
          </p>
        ) : null}

        <div
          data-testid="box-text-display"
          className="time-text-display"
          onClick={() => {
            setTogglePrivacy(!togglePrivacy);
          }}
        >
          <div className="selected-item-text" data-testid="box-item-text">
            {selectedItem.topText}
          </div>
          <div ref={privacyRef}>
            <SelectDropdown isActive={togglePrivacy} items={privacyList} setSelectedItem={setSelectedItem} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBoxContent;
