import React, { useState } from 'react';
import { FaBriefcase, FaFacebook, FaGraduationCap, FaInstagram, FaMapMarkerAlt, FaTwitter, FaYoutube } from 'react-icons/fa';
import Button from '../Button';
import ContentEditable from 'react-contenteditable';
import { SetState } from '~/types/utils';
import { BasicInfo, SocialLinks } from '~/types/user';
import BasicInfoSkeleton from './BasicInfoSkeleton';

const InfoDisplay = ({
  title,
  type,
  isCurrentUser,
  noBasicInfo,
  noSocialInfo,
  basicInfoPlaceholder,
  socialLinksPlaceholder,
  editableInputs,
  editableSocialInputs,
  loading,
  setEditableInputs,
  setEditableSocialInputs,
  updateInfo
}: Props) => {
  const [editIntroBtn, setEditIntroBtn] = useState(true);
  const { quote, work, school, location } = editableInputs;
  const { quoteMsg, workMsg, schoolMsg, locationMsg } = noBasicInfo;
  const { instagramMsg, twitterMsg, facebookMsg, youtubeMsg } = noSocialInfo;
  const { instagram, twitter, facebook, youtube } = editableSocialInputs;
  const { quotePlaceholder, workPlaceholder, schoolPlaceholder, locationPlaceholder } = basicInfoPlaceholder;
  const { instagramPlaceholder, twitterPlaceholder, facebookPlaceholder, youtubePlaceholder } = socialLinksPlaceholder;

  return (
    <>
      {loading ? (
        <BasicInfoSkeleton />
      ) : (
        <div className="side-container" data-testid="side-container">
          <div className="side-container-header">
            <p>{title}</p>
            {isCurrentUser && (
              <p className="editBtn" data-testid="editBtn" onClick={() => setEditIntroBtn(!editIntroBtn)}>
                Edit
              </p>
            )}
          </div>
          {type === 'basic' && (
            <div className="side-container-body">
              <div className="side-container-body-about" data-testid="quote">
                {editIntroBtn && !quote && <div className="no-information">{quoteMsg}</div>}
                <ContentEditable
                  data-testid="quote-editable"
                  data-placeholder={quotePlaceholder}
                  tagName="div"
                  className="about"
                  disabled={editIntroBtn}
                  html={quote || ''}
                  style={{ maxHeight: '70px', overflowY: 'auto', width: '250px' }}
                  onChange={(event) => {
                    setEditableInputs({ ...editableInputs, quote: event.target.value });
                  }}
                />
              </div>
            </div>
          )}
          <div className="side-container-body">
            <div className="side-container-body-icon">
              {type === 'basic' ? <FaBriefcase className="icon" /> : <FaInstagram className="icon instagram" />}
            </div>
            <div className="side-container-body-content" data-testid="content-1">
              {type === 'basic' && editIntroBtn && work && <>Works at </>}
              {type === 'basic' && editIntroBtn && !work && <div className="no-information">{workMsg}</div>}
              {type !== 'basic' && editIntroBtn && instagram && (
                <a className="link" href={instagram} target="_blank" rel="noreferrer noopener">
                  {instagram}
                </a>
              )}
              {type !== 'basic' && editIntroBtn && !instagram && <div className="no-information">{instagramMsg}</div>}
              <ContentEditable
                data-testid="content-1-editable"
                data-placeholder={type === 'basic' ? workPlaceholder : instagramPlaceholder}
                tagName={!editIntroBtn ? 'div' : 'span'}
                disabled={editIntroBtn}
                html={work || (instagram && !editIntroBtn ? instagram : '')}
                style={{ maxHeight: '70px', overflowY: 'auto' }}
                onChange={(event) => {
                  if (type === 'basic') {
                    setEditableInputs({ ...editableInputs, work: event.target.value });
                  } else {
                    setEditableSocialInputs({ ...editableSocialInputs, instagram: event.target.value });
                  }
                }}
              />
            </div>
          </div>

          <div className="side-container-body">
            <div className="side-container-body-icon">
              {type === 'basic' ? <FaGraduationCap className="icon" /> : <FaTwitter className="icon twitter" />}
            </div>
            <div className="side-container-body-content" data-testid="content-2">
              {type === 'basic' && editIntroBtn && school && <>Went to </>}
              {type === 'basic' && editIntroBtn && !school && <div className="no-information">{schoolMsg}</div>}
              {type !== 'basic' && editIntroBtn && twitter && (
                <a className="link" href={twitter} target="_blank" rel="noreferrer noopener">
                  {twitter}
                </a>
              )}
              {type !== 'basic' && editIntroBtn && !twitter && <div className="no-information">{twitterMsg}</div>}
              <ContentEditable
                data-testid="content-2-editable"
                data-placeholder={type === 'basic' ? schoolPlaceholder : twitterPlaceholder}
                tagName={!editIntroBtn ? 'div' : 'span'}
                disabled={editIntroBtn}
                html={school || (twitter && !editIntroBtn ? twitter : '')}
                style={{ maxHeight: '70px', overflowY: 'auto' }}
                onChange={(event) => {
                  if (type === 'basic') {
                    setEditableInputs({ ...editableInputs, school: event.target.value });
                  } else {
                    setEditableSocialInputs({ ...editableSocialInputs, twitter: event.target.value });
                  }
                }}
              />
            </div>
          </div>

          <div className="side-container-body">
            <div className="side-container-body-icon">
              {type === 'basic' ? <FaMapMarkerAlt className="icon" /> : <FaFacebook className="icon facebook" />}
            </div>
            <div className="side-container-body-content" data-testid="content-3">
              {type === 'basic' && editIntroBtn && location && <>Lives in </>}
              {type === 'basic' && editIntroBtn && !location && <div className="no-information">{locationMsg}</div>}
              {type !== 'basic' && editIntroBtn && facebook && (
                <a className="link" href={facebook} target="_blank" rel="noreferrer noopener">
                  {facebook}
                </a>
              )}
              {type !== 'basic' && editIntroBtn && !facebook && <div className="no-information">{facebookMsg}</div>}
              <ContentEditable
                data-testid="content-3-editable"
                data-placeholder={type === 'basic' ? locationPlaceholder : facebookPlaceholder}
                tagName={!editIntroBtn ? 'div' : 'span'}
                disabled={editIntroBtn}
                html={location || (facebook && !editIntroBtn ? facebook : '')}
                style={{ maxHeight: '70px', overflowY: 'auto' }}
                onChange={(e) => {
                  if (type === 'basic') {
                    setEditableInputs({ ...editableInputs, location: e.target.value });
                  } else {
                    setEditableSocialInputs({ ...editableSocialInputs, facebook: e.target.value });
                  }
                }}
              />
            </div>
          </div>

          {type !== 'basic' && (
            <div className="side-container-body">
              <div className="side-container-body-icon">
                <FaYoutube className="icon youtube" />
              </div>
              <div className="side-container-body-content" data-testid="content-4">
                {editIntroBtn && youtube && (
                  <a className="link" href={youtube} target="_blank" rel="noreferrer noopener">
                    {youtube}
                  </a>
                )}
                {editIntroBtn && !youtube && <div className="no-information">{youtubeMsg}</div>}
                {!editIntroBtn && (
                  <ContentEditable
                    data-testid="content-4-editable"
                    data-placeholder={youtubePlaceholder}
                    tagName={!editIntroBtn ? 'div' : 'span'}
                    disabled={editIntroBtn}
                    html={youtube || ''}
                    style={{ maxHeight: '70px', overflowY: 'auto' }}
                    onChange={(e) => {
                      setEditableSocialInputs({ ...editableSocialInputs, youtube: e.target.value });
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {isCurrentUser && (
            <div className="intro-submit-button">
              <Button
                label="Update"
                className="button updateBtn"
                disabled={editIntroBtn}
                handleClick={() => {
                  setEditIntroBtn(true);
                  updateInfo();
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default InfoDisplay;

interface Props {
  title: string;
  type: string;
  isCurrentUser: boolean;
  noBasicInfo: {
    quoteMsg: string;
    workMsg: string;
    schoolMsg: string;
    locationMsg: string;
  };
  noSocialInfo: {
    instagramMsg: string;
    twitterMsg: string;
    facebookMsg: string;
    youtubeMsg: string;
  };
  basicInfoPlaceholder: {
    quotePlaceholder: string;
    workPlaceholder: string;
    schoolPlaceholder: string;
    locationPlaceholder: string;
  };
  socialLinksPlaceholder: {
    instagramPlaceholder: string;
    twitterPlaceholder: string;
    facebookPlaceholder: string;
    youtubePlaceholder: string;
  };
  editableInputs: BasicInfo;
  editableSocialInputs: SocialLinks;
  loading: boolean;
  setEditableInputs: SetState<BasicInfo>;
  setEditableSocialInputs: SetState<SocialLinks>;
  updateInfo: () => void;
}
