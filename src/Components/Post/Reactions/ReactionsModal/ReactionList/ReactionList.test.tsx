import { beforeEach, describe, expect, it } from 'vitest';
import ReactionList from '~/Components/Post/Reactions/ReactionsModal/ReactionList';
import { postMockData, postReactionOne, postReactionTwo } from '~/mocks/data/post.mock';
import { PostUtils } from '~/services/utils/post-utils.service';
import { renderWithRouter, screen } from '~/test.utils';

describe('ReactionsModal', () => {
  it('should have empty list items', () => {
    renderWithRouter(<ReactionList postReactions={[]} />);
    const wrapper = screen.queryByTestId('modal-reactions-container') as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.childNodes.length).toEqual(0);
  });

  it('should have list items', () => {
    renderWithRouter(<ReactionList postReactions={[postReactionOne, postReactionTwo]} />);
    const reactionList = screen.queryAllByTestId('reaction-list');
    const imageElements = screen.queryAllByRole('img');
    expect(reactionList.length).toEqual(2);
    expect(imageElements[0]).toHaveAttribute('src', 'https://place-hold.it/500x500');
    expect(imageElements[1]).toHaveAttribute('src', '/src/assets/reactions/happy.png');
  });
});
