import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithRouter, screen, waitFor } from '~/test.utils';
import userEvent from '@testing-library/user-event';
import NotificationPreview, { NotificationPreviewProps } from '~/Components/Dialog/NotificationPreview';

describe('NotificationPreview', () => {
  const buttonClick = vi.fn();

  it('should have only button', () => {
    const props: NotificationPreviewProps = {
      title: '',
      post: '',
      imgUrl: '',
      comment: '',
      reaction: '',
      senderName: '',
      secondButtonText: 'Button 1',
      secondBtnHandler: vi.fn()
    };
    renderWithRouter(<NotificationPreview {...props} />);
    const buttonOne = screen.getByText('Button 1');
    expect(buttonOne).toBeInTheDocument();
  });

  const props: NotificationPreviewProps = {
    title: 'Title',
    post: 'This is my post',
    imgUrl: 'https://place-hold.it',
    comment: 'comment',
    reaction: 'love',
    senderName: 'Danny',
    secondButtonText: 'Button 1',
    secondBtnHandler: vi.fn()
  };
  it('should have other elements', () => {
    renderWithRouter(<NotificationPreview {...props} />);
    const title = screen.getByText('Title');
    const post = screen.getByText('This is my post');
    const imgElement = screen.getAllByRole('img');
    const comment = screen.getByText('comment');
    const reaction = screen.getByTestId('reaction');

    expect(title).toBeInTheDocument();
    expect(post).toBeInTheDocument();
    expect(comment).toBeInTheDocument();
    expect(imgElement[0]).toHaveAttribute('src', 'https://place-hold.it');
    expect(reaction.childNodes[0].textContent).toBe('Danny reacted on your post with');
    expect(imgElement[1]).toHaveAttribute('src', '/src/assets/reactions/love.png');
  });

  it('should handle click', async () => {
    const user = userEvent.setup();
    renderWithRouter(<NotificationPreview {...props} />);
    const buttonOne = screen.getByText('Button 1');
    await user.click(buttonOne);
    expect(props.secondBtnHandler).toHaveBeenCalledTimes(1);
  });
});
