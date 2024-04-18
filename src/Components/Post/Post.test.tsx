import { renderWithRouter, screen } from '~/test.utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { postMockData } from '~/mocks/data/post.mock';

import { store } from '~/redux/store';
import { updatePostItem } from '~/redux/reducers/post/post.reducer';
import Post from '~/Components/Post';
import { timeAgo } from '~/services/utils/timeago.utils';
import userEvent from '@testing-library/user-event';
import { toggleCommentBox } from '~/redux/reducers/modal/modal.reducer';

describe('Post', () => {
  beforeEach(() => {
    store.dispatch(updatePostItem(postMockData));
    store.dispatch(toggleCommentBox(true));
  });

  afterEach(() => {
    postMockData.bgColor = '#f44336';
    postMockData.post = 'how are you?';
    window.localStorage.removeItem('selectedPostId');
  });

  it('should have post wrapper', () => {
    renderWithRouter(<Post post={postMockData} showIcons={false} loading={false} />);
    const postWrapper = screen.queryByTestId('post');
    expect(postWrapper).toBeInTheDocument();
  });

  it('should have user avatar', () => {
    renderWithRouter(<Post post={postMockData} showIcons={false} loading={false} />);
    const imgElements = screen.queryAllByRole('img');
    expect(imgElements[0]).toBeInTheDocument();
  });

  it('should have username', async () => {
    renderWithRouter(<Post post={postMockData} showIcons={false} loading={false} />);
    const usernameElement = await screen.findByTestId('username');
    expect(usernameElement).toBeInTheDocument();
    expect(usernameElement.childNodes.item(0).textContent).toEqual(postMockData.username);
  });

  it('should have feelings element', async () => {
    renderWithRouter(<Post post={postMockData} showIcons={false} loading={false} />);
    const feelingsElement = await screen.findByTestId('inline-display');
    expect(feelingsElement).toBeInTheDocument();
    expect(feelingsElement.textContent).toEqual('is feeling  happy');
  });

  it('should display post icons', async () => {
    renderWithRouter(<Post post={postMockData} showIcons={true} loading={false} />);
    const postIconElement = await screen.findByTestId('post-icons');
    expect(postIconElement).toBeInTheDocument();
    expect(postIconElement.childNodes.length).toEqual(2);
  });

  it('should display post time and privacy', async () => {
    const { baseElement } = renderWithRouter(<Post post={postMockData} showIcons={false} loading={false} />);
    const timeDisplayElement = await screen.findByTestId('time-display');
    expect(timeDisplayElement).toBeInTheDocument();
    expect(timeDisplayElement.childNodes.item(0).textContent).toEqual(timeAgo.transform(postMockData.createAt));
    expect(baseElement.querySelector('.globe')).toBeInTheDocument();
  });

  it('should display post', async () => {
    postMockData.bgColor = '#ffffff';
    renderWithRouter(<Post post={postMockData} showIcons={false} loading={false} />);
    const userPostElement = await screen.findByTestId('user-post');
    expect(userPostElement).toBeInTheDocument();
    expect(userPostElement.textContent).toEqual(postMockData.post);
  });

  it('should display post with colored background', async () => {
    renderWithRouter(<Post post={postMockData} showIcons={false} loading={false} />);
    const userPostElement = await screen.findByTestId('user-post-with-bg');
    expect(userPostElement).toBeInTheDocument();
    expect(userPostElement).toHaveStyle({ backgroundColor: 'rgb(244, 67, 54)' });
  });

  it('should display post image', async () => {
    postMockData.bgColor = '#ffffff';
    renderWithRouter(<Post post={postMockData} showIcons={false} loading={false} />);
    const postImage = await screen.findByTestId('post-image');
    expect(postImage).toBeInTheDocument();
    expect(postImage.childNodes.item(0).childNodes.item(0)).toHaveAttribute('src', 'https://res.cloudinary.com/dyn3w0n6w/image/upload/v2/1');
  });

  it('should display image modal on image click', async () => {
    const user = userEvent.setup();
    postMockData.bgColor = '#ffffff';
    renderWithRouter(<Post post={postMockData} showIcons={false} loading={false} />);
    const postImage = await screen.findByTestId('post-image');
    user.click(postImage);
    const imageModal = await screen.findByTestId('image-modal');
    expect(imageModal).toBeInTheDocument();
  });

  it('should display comment section', async () => {
    renderWithRouter(<Post post={postMockData} showIcons={false} loading={false} />);
    const commentSection = await screen.findByTestId('comment-section');
    expect(commentSection).toBeInTheDocument();
  });

  it('should display comment input', async () => {
    renderWithRouter(<Post post={postMockData} showIcons={false} loading={false} />);
    const commentInput = await screen.findByTestId('comment-input');
    expect(commentInput).toBeInTheDocument();
  });
});
