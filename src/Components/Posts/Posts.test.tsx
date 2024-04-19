import { renderWithRouter, screen } from '~/test.utils';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Posts, { IPostsProps } from '~/Components/Posts';
import { postMockData } from '~/mocks/data/post.mock';
import { Utils } from '~/services/utils/utils.service';
import { PostUtils } from '~/services/utils/post-utils.service';
import { addUser } from '~/redux/reducers/user/user.reducer';
import { existingUser, userJwt } from '~/mocks/data/user.mock';
import { store } from '~/redux/store';
describe('Posts', () => {
  let props: IPostsProps;

  beforeAll(() => {
    store.dispatch(addUser({ token: userJwt, profile: existingUser }));
  });

  beforeEach(() => {
    props = {
      posts: [],
      userFollowing: [],
      postsLoading: false
    };
  });

  it('should not have post items', () => {
    renderWithRouter(<Posts {...props} />);
    const postItems = screen.queryAllByTestId('posts-item');
    expect(postItems.length).toEqual(0);
  });

  it('should have post items', () => {
    props.posts = [postMockData];
    renderWithRouter(<Posts {...props} />);
    const postItems = screen.queryAllByTestId('posts-item');
    expect(postItems.length).toEqual(1);
  });

  it('should not display post if user is blocked', async () => {
    vi.spyOn(Utils, 'checkIfUserIsBlocked').mockReturnValue(true);
    vi.spyOn(PostUtils, 'checkPrivacy').mockReturnValue(true);
    props.posts = [postMockData];
    renderWithRouter(<Posts {...props} />);

    const postElement = screen.queryByTestId('post');
    expect(postElement).not.toBeInTheDocument();
  });

  it('should display post if post is public', async () => {
    vi.spyOn(Utils, 'checkIfUserIsBlocked').mockReturnValue(false);
    vi.spyOn(PostUtils, 'checkPrivacy').mockReturnValue(true);
    props.posts = [postMockData];
    renderWithRouter(<Posts {...props} />);
    const postElement = await screen.findByTestId('post');
    expect(postElement).toBeInTheDocument();
  });

  it('should not display post if post is private', async () => {
    vi.spyOn(Utils, 'checkIfUserIsBlocked').mockReturnValue(false);
    vi.spyOn(PostUtils, 'checkPrivacy').mockReturnValue(false);
    props.posts = [postMockData];
    renderWithRouter(<Posts {...props} />);
    const postElement = screen.queryByTestId('post');
    expect(postElement).not.toBeInTheDocument();
  });
});
