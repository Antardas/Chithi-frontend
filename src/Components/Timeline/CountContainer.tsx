import React from 'react';
import CountContainerSkeleton from './CountContainerSkeleton';
import { PostUtils } from '~/services/utils/post-utils.service';

const CountContainer = ({ followingCount, followersCount, loading }: Props) => {
  return (
    <>
      {loading ? (
        <CountContainerSkeleton />
      ) : (
        <div className="count-container" data-testid="count-container">
          <div className="followers-count">
            <span className="count" data-testid="info">
              {PostUtils.shortenLargeNumberReactions(followersCount)}
            </span>
            <p>{`${followersCount > 1 ? 'Followers' : 'Follower'}`}</p>
          </div>
          <div className="vertical-line"></div>
          <div className="following-count">
            <span className="count" data-testid="info">
              {PostUtils.shortenLargeNumberReactions(followingCount)}
            </span>
            <p>Following</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CountContainer;

interface Props {
  followingCount: number;
  followersCount: number;
  loading: boolean;
}
