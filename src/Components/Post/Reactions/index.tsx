import React from 'react';
import '~/Components/Post/Reactions/Reactions.scss';
import { reactionsMap } from '~/services/utils/static.data';
const Reactions = ({ onClick, showLabel = true }: IReactionProps) => {
  const reactions = ['like', 'love', 'wow', 'haha', 'sad', 'angry'];

  return (
    <div className="reactions" data-testid="reactions">
      <ul>
        {reactions.map((reaction, index) => (
          <li key={index} onClick={() => onClick(reaction)} data-testid="reaction">
            {showLabel && <label>{reaction}</label>}
            <img src={reactionsMap[reaction]} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reactions;

interface IReactionProps {
  onClick: (reaction: string) => void;
  showLabel?: boolean;
}
