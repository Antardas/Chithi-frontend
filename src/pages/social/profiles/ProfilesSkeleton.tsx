import BackgroundHeaderSkeleton from "~/Components/BackgroundHeader/BackgroundHeaderSkeleton";
import PostFormSkeleton from "~/Components/Post/PostForm/PostFormSkeleton";
import PostSkeleton from "~/Components/Post/PostSkeleton";
import { tabItems } from "~/services/utils/static.data";
import '~/pages/social/profiles/Profiles.scss'
const ProfileSkeleton = () => {
  return (
    <div className="profile-wrapper">
      <div className="profile-wrapper-container">
        <div className="profile-header">
          <BackgroundHeaderSkeleton tabItems={tabItems(true, true)} />
        </div>
        <div className="profile-content">
          <div className="timeline-wrapper-container-main">
            <div style={{ marginBottom: '10px' }}>
              <PostFormSkeleton />
            </div>
            <>
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index}>
                  <PostSkeleton />
                </div>
              ))}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileSkeleton;