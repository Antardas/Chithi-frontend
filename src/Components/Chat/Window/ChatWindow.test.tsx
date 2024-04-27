import userEvent from '@testing-library/user-event';
import { createSearchParams } from 'react-router-dom';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Sidebar from '~/Components/Sidebar';
import { messageData } from '~/mocks/data/chat.mock';
import { existingUser } from '~/mocks/data/user.mock';
import { chatMessagesMock } from '~/mocks/handlers/chat';
import { socketIOMock } from '~/mocks/handlers/sokcet';
import { server } from '~/mocks/server';
import { addToChatList } from '~/redux/reducers/chat/chat.reducer';
import { addUser } from '~/redux/reducers/user/user.reducer';
import { store } from '~/redux/store';
import { socketService } from '~/services/socket/sokcet.service';
import { sideBarItems } from '~/services/utils/static.data';
import { prettyDOM, renderWithRouter, routeObject, screen, waitFor, within } from '~/test.utils';
import ChatWindow from '.';

const user = userEvent.setup({});
describe('ChatWindow', () => {
  beforeEach(() => {
    store.dispatch(addUser({ token: '123456', profile: existingUser }));
    store.dispatch(addToChatList({ isLoading: false, chatList: [messageData] }));

    const url = `/app/social/profile/${existingUser?.username}?${createSearchParams({
      id: existingUser._id as string,
      uId: existingUser.uId as string
    })}`;

    server.use(chatMessagesMock);
  });

  it('should have items displayed', async () => {
    store.dispatch(addToChatList({ isLoading: true, chatList: [messageData] }));
    renderWithRouter(<ChatWindow />);
    const messageLoading = await screen.findByTestId('message-loading');
    expect(messageLoading).toBeInTheDocument();
  });

  it('should display chat title', async () => {
    renderWithRouter(<ChatWindow />);
    const chatTitle = await screen.findByTestId('chat-title');
    expect(chatTitle).toBeInTheDocument();
  });

  it('should display chat window', async () => {
    renderWithRouter(<ChatWindow />);
    const chatWindow = await screen.findByTestId('message-page');
    expect(chatWindow).toBeInTheDocument();
  });

  it('should display chat input', async () => {
    renderWithRouter(<ChatWindow />);
    const chatInput = await screen.findByTestId('chat-inputarea');
    expect(chatInput).toBeInTheDocument();
  });
});
