import { renderWithRouter, screen } from '~/test.utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { postMockData, postReactionOne } from '~/mocks/data/post.mock';

import { addUser } from '~/redux/reducers/user/user.reducer';
import { existingUser, userJwt } from '~/mocks/data/user.mock';
import { store } from '~/redux/store';
import { addReactions } from '~/redux/reducers/post/userReactions.reducer';
import CommentArea from '~/Components/Post/CommentArea';
import userEvent from '@testing-library/user-event';

describe('CommentArea', () => {
  beforeEach(() => {
    store.dispatch(addReactions([]));
    store.dispatch(addUser({ token: userJwt, profile: existingUser }));
  });

  it('should display default reaction icon and name', () => {
    renderWithRouter(<CommentArea post={postMockData} setPost={() => {}} />);
    const defaultReaction = screen.queryByTestId('default-reaction') as HTMLElement;

    expect(defaultReaction).toBeInTheDocument();
    expect(defaultReaction.childNodes.item(0)).toHaveAttribute('src', '/src/assets/reactions/like.png');
    expect(defaultReaction.childNodes.item(1).textContent).toEqual('Like');
  });

  it('should display selected reaction icon and name', async () => {
    const user = userEvent.setup();
    store.dispatch(addReactions([postReactionOne]));

    renderWithRouter(<CommentArea post={postMockData} setPost={() => {}} />);
    const reactionItem = screen.queryAllByTestId('reaction');

    await user.click(reactionItem[1]);

    const selectedReaction = await screen.findByTestId('selected-reaction');
    expect(selectedReaction).toBeInTheDocument();
    expect(selectedReaction.childNodes.item(0)).toHaveAttribute('src', '/src/assets/reactions/love.png');
    expect(selectedReaction.childNodes.item(1).textContent).toEqual('Love');
  });
});
