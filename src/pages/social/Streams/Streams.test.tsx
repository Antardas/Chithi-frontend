import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { postMockData } from '~/mocks/data/post.mock';
import { addPosts } from '~/redux/reducers/post/posts.reducer';
import { store } from '~/redux/store';
import { renderWithRouter, screen, waitFor } from '~/test.utils';
import Streams from '~/pages/social/Streams';
import { addUser } from '~/redux/reducers/user/user.reducer';
import { existingUser, userJwt } from '~/mocks/data/user.mock';
import { getReactionsByUsernameMock } from '~/mocks/handlers/reaction';
import { server } from '~/mocks/server';
import { emptyPostsMock } from '~/mocks/handlers/post';

describe('Streams', () => {
  beforeAll(() => {
    window.localStorage.setItem('username', 'Manny');
    store.dispatch(addPosts([postMockData]));
    store.dispatch(addUser({ token: userJwt, profile: existingUser }));
  });

  afterAll(() => {
    window.localStorage.removeItem('username');
  });

  it('should not be null', async () => {
    renderWithRouter(<Streams />);
    const streamElementItems = screen.getByTestId('streams');

    await waitFor(() => {
      expect(streamElementItems).not.toBeNull();
    });
  });

  it('should have post form component', async () => {
    server.use(getReactionsByUsernameMock);
    renderWithRouter(<Streams />);

    const postForm = screen.queryByTestId('post-form');
    // await act(() => {
    // });
    await waitFor(() => {
      expect(postForm).toBeInTheDocument();
    });
  });

  it('should have posts component', async () => {
    renderWithRouter(<Streams />);
    // let posts;
    const posts = screen.queryByTestId('posts');
    // await act(() => {
    // });
    await waitFor(() => {
      expect(posts).toBeInTheDocument();
    });
  });

  it('should have suggestions component', async () => {
    renderWithRouter(<Streams />);

    const suggestions = screen.queryByTestId('suggestions-container');
    // await act(() => {});
    await waitFor(() => {
      expect(suggestions).toBeInTheDocument();
    });
  });

  it('should have empty posts component', async () => {
    server.use(emptyPostsMock);
    store.dispatch(addPosts([]));
    renderWithRouter(<Streams />);
    const posts = screen.queryByTestId('posts-item');

    await waitFor(() => {
      expect(posts).not.toBeInTheDocument();
    });
  });
});
