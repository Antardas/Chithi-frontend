// import React from 'react'
import { useEffect, useRef } from 'react';
import Suggestion from '~/Components/Suggestions';
import useEffectOnce from '~/hooks/useEffectOnce';
import '~/pages/social/Streams/Streams.scss';
import { getSuggestions } from '~/redux/api/suggestion';
import { useAppDispatch } from '~/redux/store';
const Streams = () => {
  const bodyRef = useRef<HTMLInputElement | null>(null);
  const bottomLineRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  useEffectOnce(() => {
    dispatch(getSuggestions());
  });
  return (
    <div className="steams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          <div>Post Form</div>
          <div>Post Items</div>
          <div
            style={{
              marginBottom: '50px',
              height: '50px'
            }}
            ref={bottomLineRef}
          ></div>
        </div>

        <div className="streams-suggestions">
          <Suggestion />
        </div>
      </div>
    </div>
  );
};

export default Streams;
