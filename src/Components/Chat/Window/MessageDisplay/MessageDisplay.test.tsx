import userEvent from '@testing-library/user-event';
import { createSearchParams } from 'react-router-dom';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Sidebar from '~/Components/Sidebar';
import useDetectOutsideClick from '~/hooks/useDetectOutsideClick';
import { messageData, messageDataTwo } from '~/mocks/data/chat.mock';
import { existingUser, existingUserFour } from '~/mocks/data/user.mock';
import { chatMessagesMock } from '~/mocks/handlers/chat';
import { socketIOMock } from '~/mocks/handlers/sokcet';
import { server } from '~/mocks/server';
import { addToChatList } from '~/redux/reducers/chat/chat.reducer';
import { addUser } from '~/redux/reducers/user/user.reducer';
import { store } from '~/redux/store';
import { socketService } from '~/services/socket/sokcet.service';
import { sideBarItems } from '~/services/utils/static.data';
import { fireEvent, prettyDOM, renderWithRouter, routeObject, screen, waitFor, within } from '~/test.utils';
import MessageDisplay, { IMessageDisplayProps } from '.';
import { RefObject } from 'react';
import { timeAgo } from '~/services/utils/timeago.utils';

const user = userEvent.setup({});
vi.mock('~/hooks/useDetectOutsideClick');
const useDetectOutsideClickMocked = vi.mocked(useDetectOutsideClick);
describe('MessageDisplay', () => {
  let props: IMessageDisplayProps;
  beforeEach(() => {
    props = {
      chatMessages: [],
      profile: existingUser,
      updateMessageReaction: () => {},
      deleteChatMessage: () => {}
    };
  });
  const useDetectOutsideClickSpy = useDetectOutsideClickMocked.mockReturnValue([false, null]);

  it('should have empty message chat', async () => {
    renderWithRouter(<MessageDisplay {...props} />);
    const messagePage = await screen.findByTestId('message-page');
    expect(messagePage).toBeInTheDocument();
    expect(messagePage.childNodes.length).toEqual(0);
  });

  it('should have message chat', async () => {
    props.chatMessages = [messageData];
    renderWithRouter(<MessageDisplay {...props} />);
    const messageChat = await screen.findByTestId('message-chat');
    console.log(messageChat);

    expect(messageChat).toBeInTheDocument();
    expect(messageChat.childNodes.length).toBeGreaterThan(0);
  });

  it('should display chat time ago', async () => {
    props.chatMessages = [messageData];
    renderWithRouter(<MessageDisplay {...props} />);
    const messageChatDate = await screen.findByTestId('message-chat-date');
    expect(messageChatDate).toBeInTheDocument();
    expect(messageChatDate.textContent).toEqual('15 May 2022');
  });

  it('should have only right side messages', async () => {
    props.chatMessages = [messageData];
    renderWithRouter(<MessageDisplay {...props} />);
    const timeFormat = timeAgo.transform(messageData.createdAt);
    const rightSideElement = await screen.findAllByTestId('right-message');
    const chatMessageElement = await screen.findAllByText(/this is a message/i);
    const chatTimeElement = await screen.findAllByTestId('chat-time');
    expect(rightSideElement[0]).toBeInTheDocument();
    expect(chatMessageElement[0]).toBeInTheDocument();
    expect(chatTimeElement[0]).toBeInTheDocument();
    expect(chatMessageElement[0].textContent).toEqual('This is a message');
    expect(chatTimeElement[0].textContent).toEqual(timeFormat);
  });

  it('should have only left side messages', async () => {
    props.profile = existingUserFour;
    props.chatMessages = [messageDataTwo];
    renderWithRouter(<MessageDisplay {...props} />);
    const timeFormat = timeAgo.timeFormat(messageDataTwo.createdAt);
    const leftSideElement = await screen.findAllByTestId('left-message');
    const chatMessageElement = await screen.findAllByText(/this is a message/i);
    const chatTimeElement = await screen.findAllByTestId('chat-time');
    expect(leftSideElement[0]).toBeInTheDocument();
    expect(chatMessageElement[0]).toBeInTheDocument();
    expect(chatTimeElement[0]).toBeInTheDocument();
    expect(chatMessageElement[0].textContent).toEqual('This is a message');
    expect(chatTimeElement[0].textContent).toEqual(timeFormat);
  });

  it('should display reactions container', async () => {
    useDetectOutsideClickSpy.mockReturnValue([true, null]);
    props.chatMessages = [messageData];
    renderWithRouter(<MessageDisplay {...props} />);
    const messageContent = await screen.findAllByTestId('message-content');
    fireEvent.mouseOver(messageContent[0]);
    const reactionsElement = await screen.findAllByTestId('reactions');
    expect(reactionsElement[0]).toBeInTheDocument();
  });

  it('should display reactions dialog', async () => {
    props.chatMessages = [messageData];
    renderWithRouter(<MessageDisplay {...props} />);
    const reactionImage = await screen.findAllByTestId('reaction-img');
    expect(reactionImage[0]).toBeInTheDocument();
    userEvent.click(reactionImage[0]);
    const dialogContainer = await screen.findAllByTestId('dialog-container');
    expect(dialogContainer[0]).toBeInTheDocument();
  });
});
