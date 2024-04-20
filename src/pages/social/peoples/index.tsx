import { AxiosError } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import Avatar from '~/Components/Avatar';
import useEffectOnce from '~/hooks/useEffectOnce';
import useInfinityScroll from '~/hooks/useInfinityScroll';
import '~/pages/social/peoples/Peoples.scss';
import { useAppDispatch } from '~/redux/store';
import { PostUtils } from '~/services/utils/post-utils.service';
import { Utils } from '~/services/utils/utils.service';
import { IError } from '~/types/axios';
const PAGE_SIZE = 30;
const Peoples = () => {
  const [users, setUsers] = useState<unknown[]>([]);
  const [onlineUser, setOnlinUsers] = useState<unknown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const bottomLineRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const setNextPage = () => {
    console.log('caleed');

    if (currentPage <= Math.ceil(totalPost / PAGE_SIZE)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getAllPost = () => {
    setLoading(true);
    try {
      if (currentPage) {
        // Call API
      }
    } catch (error) {
      Utils.addErrorNotification(error);
    }
    setLoading(false);
  };
  useInfinityScroll(bodyRef, bottomLineRef, setNextPage);

  useEffectOnce(() => {
    // dispatch(getSuggestions());
    setCurrentPage(currentPage + 1);
  });
  // console.log('🚀 ~ useEffectOnce ~ dispatch:', dispatch);

  useEffect(() => {
    getAllPost();
  }, [currentPage]);
  return (
    <div className="card-container" ref={bodyRef}>
      <div className="people">People</div>
      <div className="card-element">
        {/* People Card */}
        {users.map((item, index) => (
          <div className="card-element-item" key={`users-${index}`} data-testid="card-element-item">
            {Utils.checkIfUserIsBlocked(item.username, onlineUser) ? (
              <div className="card-element-item-indicator">
                <FaCircle className="online-indicator" />
              </div>
            ) : null}

            <div className="card-element-header">
              <div className="card-element-header-bg"></div>
              <Avatar name={item.username} bgColor={item.avatarColor} textColor="#ffffff" size={120} avatarSrc={item.profilePicture} />
              <div className="card-element-header-text">
                <span className="data-username">{item.username}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && !users.length ? (
        <div
          className="card-element"
          style={{
            height: '350px'
          }}
        ></div>
      ) : null}
      {!loading && !users.length ? (
        <div className="empty-page" data-testid="empty-page">
          No user available
        </div>
      ) : null}

      <div ref={bottomLineRef} style={{ marginBottom: '80px', height: '50px' }}></div>
    </div>
  );
};

export default Peoples;
