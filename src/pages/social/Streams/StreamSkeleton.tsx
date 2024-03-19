import React from 'react';
import SuggestionSkeleton from '~/Components/Suggestions/SuggestionSkeleton';

const StreamSkeleton = () => {
  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post">
          {/* <PostFormSkeleton />
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index}>
              <PostSkeleton />
            </div>
          ))} */}
        </div>
        <div className="streams-suggestions">
          <SuggestionSkeleton />
        </div>
      </div>
    </div>
  );
};

export default StreamSkeleton;
