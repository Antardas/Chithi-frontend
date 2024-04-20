import React from 'react';
import { PostUtils } from '~/services/utils/post-utils.service';
import { Utils } from '~/services/utils/utils.service';

const CardElement = ({ followersCount, followingCount, postCount }: CardElementProps) => {
  return (
    <div className="card-element-stats">
      <div className="card-element-stats-group">
        <p className="card-element-stats-group-title"> Posts</p>
        <h5 className="card-element-stats-group-info" data-testid="info">
          {PostUtils.shortenLargeNumberReactions(postCount)}
        </h5>
      </div>
      <div className="card-element-stats-group">
        <p className="card-element-stats-group-title">Followers</p>
        <h5 className="card-element-stats-group-info" data-testid="info">
          {PostUtils.shortenLargeNumberReactions(followersCount)}
        </h5>
      </div>
      <div className="card-element-stats-group">
        <p className="card-element-stats-group-title">Followings</p>
        <h5 className="card-element-stats-group-info" data-testid="info">
          {PostUtils.shortenLargeNumberReactions(followingCount)}
        </h5>
      </div>
    </div>
  );
};

export default CardElement;

export interface CardElementProps {
  postCount: number;
  followingCount: number;
  followersCount: number;
}
