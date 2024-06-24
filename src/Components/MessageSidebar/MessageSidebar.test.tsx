import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter, screen } from '~/test.utils';
import MessageSidebar from '~/Components/MessageSidebar';
import { existingUser } from '~/mocks/data/user.mock';
import { IMessageData } from '~/types/message';
import userEvent from '@testing-library/user-event';
import { IMessageList } from '~/types/chat';
const messageData: IMessageList = {
  _id: '12345',
  conversationId: '23456',
  receiverId: '1q2w3e4r5t',
  receiverUsername: 'Antar_1',
  receiverAvatarColor: 'red',
  receiverProfilePicture: 'https://place-hold.i',
  senderUsername: 'Danny',
  senderId: '2w3e4r5t6y',
  senderAvatarColor: 'blue',
  senderProfilePicture: 'https://place-hold.i',
  body: 'This is the message body',
  isRead: false,
  gifUrl: '',
  selectedImage: '',
  reaction: [],
  createdAt: new Date().toString(),
  deleteForEveryone: false,
  deleteForMe: false
};
describe('MessageSidebar', () => {
  it('should display message notification content', () => {
    const props = {
      profile: existingUser,
      messageCount: 1,
      messageNotifications: [messageData, messageData],
      openChatPage: vi.fn()
    };

    renderWithRouter(<MessageSidebar {...props} />);

    const smallElement = screen.getByText(1);
    const infoContainer = screen.getByTestId('info-container');
    expect(smallElement).toBeInTheDocument();
    expect(infoContainer.childElementCount).toEqual(2);
  });
  it('should display message notification content items', () => {
    const props = {
      profile: existingUser,
      messageCount: 1,
      messageNotifications: [messageData, messageData],
      openChatPage: vi.fn()
    };

    const { baseElement } = renderWithRouter(<MessageSidebar {...props} />);
    const contentAvatar = baseElement.querySelector('.content-avatar');
    const title = baseElement.querySelector('.title') as Element;
    const body = baseElement.querySelector('.subtext') as Element;
    const notRead = baseElement.querySelector('.not-read');
    expect(contentAvatar).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(body).toBeInTheDocument();
    expect(notRead).toBeInTheDocument();
    expect(title.textContent).toEqual('Antar_1');
    expect(body.textContent).toEqual('This is the message body');
  });
  it('should handle on click', async () => {
    const user = userEvent.setup();
    const openChatPage = vi.fn();
    const props = {
      profile: existingUser,
      messageCount: 1,
      messageNotifications: [messageData, messageData],
      openChatPage: openChatPage
    };

    const { baseElement } = renderWithRouter(<MessageSidebar {...props} />);
    const messageCard = baseElement.querySelectorAll('.message-sub-card');

    await user.click(messageCard[0]);
    expect(openChatPage).toHaveBeenCalledTimes(1);
  });
});
