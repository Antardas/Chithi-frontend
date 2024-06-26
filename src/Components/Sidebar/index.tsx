import React, { useCallback, useEffect, useState } from 'react';
import { ISideBarItems, fontAwesomeIcons, sideBarItems } from '~/services/utils/static.data';
import '~/Components/Sidebar/Sidebar.scss';
import { Location, createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '~/redux/store';
import { getPosts } from '~/redux/api/posts';
import { Utils } from '~/services/utils/utils.service';
import { ChatUtils } from '~/services/utils/chat-utils.service';
import { chatService } from '~/services/api/chat/chat.service';
import { socketService } from '~/services/socket/sokcet.service';
import { IUser } from '~/types/user';
import { IMessageList } from '~/types/chat';
const Sidebar = () => {
  const [sidebar, setSidebar] = useState<Array<ISideBarItems>>([]);
  const location: Location<unknown> = useLocation();
  const { profile } = useSelector((state: RootState) => state.user);
  const { chatList } = useSelector((state: RootState) => state.chat);
  const [chatPageName, setChatPageName] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const checkUrl = (name: string) => {
    return location.pathname.includes(name.toLowerCase());
  };

  const leaveChatPage = async () => {
    try {
      if (chatList.length) {
        const chatUser = chatList[0];
        const receiver = chatUser.receiverUsername !== profile?.username ? chatUser.receiverUsername : chatUser.senderUsername;
        ChatUtils.privateChatMessages = [];
        await chatService.removeChatUser({
          sender: profile?.username as string,
          receiver
        });
      }
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };

  const createChatUrlParams = useCallback(
    (url: string) => {
      if (chatList.length) {
        const user = chatList[0];
        const obj = {
          receiverId: user.receiverId,
          receiverName: user.receiverUsername,
          senderId: user.senderId,
          senderName: user.senderUsername
        };
        const params = ChatUtils.chatUrlParams(obj, profile as IUser);
        ChatUtils.joinRoomEvent(obj, profile as IUser);
        return `${url}?${createSearchParams(params)}`;
      }
      return url;
    },
    [chatList, profile]
  );

  const navigateToTop = (name: string, url: string): void => {
    let newUrl = url;
    if (name === 'Profile') {
      newUrl = `${url}/${profile?.username}?${createSearchParams({
        id: `${profile?._id ?? ''}`,
        uId: `${profile?.uId ?? ''}`
      })}`;
    } else if (name === 'Streams') {
      dispatch(getPosts(1));
    } else if (name === 'Chat') {
      setChatPageName(name);
    } else {
      setChatPageName('');
      leaveChatPage();
    }
    navigate(newUrl);
    // socketService.socket.off('MESSAGE_RECEIVED');
  };

  const markMessageAsRead = useCallback(
    async (user: IMessageList) => {
      try {
        const receiver = user.receiverUsername !== profile?.username ? user.receiverUsername : user.senderUsername;
        const receiverId = user.receiverUsername !== profile?.username ? user.receiverId : user.senderId;
        await chatService.markAsRead({
          sender: profile?._id as string,
          receiver: receiverId
        });

        await chatService.addChatUsers({
          sender: profile?.username as string,
          receiver: receiver
        });
      } catch (error) {
        Utils.addErrorNotification(error, dispatch);
      }
    },
    [dispatch, profile]
  );

  useEffect(() => {
    setSidebar(sideBarItems);
  }, []);
  useEffect(() => {
    if (chatPageName === 'Chat') {
      const url = createChatUrlParams('/app/social/chat/messages');

      if (chatList.length && !chatList[0].isRead) {
        markMessageAsRead(chatList[0]);
      }
      navigate(url);
    }
  }, [createChatUrlParams, chatPageName, navigate, markMessageAsRead, chatList]);

  return (
    <div className="app-side-menu">
      <div className="side-menu">
        <ul className="list-unstyled">
          {sidebar.map((item) => (
            <li key={item.index} onClick={() => navigateToTop(item.name, item.url)}>
              <div className={`sidebar-link ${checkUrl(item.name) ? 'active' : ''}`} data-testid="sidebar-list">
                <div className="menu-icon">{fontAwesomeIcons[item.iconName as keyof typeof fontAwesomeIcons]}</div>
                <div className="menu-link">
                  <span>{item.name}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
