import React from 'react';
import Avatar from '~/Components/Avatar';
import { reactionsMap } from '~/services/utils/static.data';
import { IReactionPost } from '~/types/reaction';
import '~/Components/Post/Reactions/ReactionsModal/ReactionList/ReactionList.scss'

const ReactionList = ({ postReactions }: Props) => {
  return (
    <div className="modal-reactions-container" data-testid="modal-reactions-container">
      {postReactions.map((reaction) => (
        <div className="modal-reactions-container-list" key={reaction._id} data-testid="reaction-list">
          <div className="img">
            <Avatar name={reaction?.username} bgColor={reaction?.avatarColor} textColor="#ffffff" size={50} avatarSrc={reaction?.profilePicture} />
            <img src={`${reactionsMap[reaction?.type]}`} alt="" className="reaction-icon" />
          </div>
          <span>{reaction?.username}</span>
        </div>
      ))}
    </div>
  );
};

export default ReactionList;
interface Props {
  postReactions: IReactionPost[];
}
