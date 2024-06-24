import { beforeEach, describe, expect, it } from 'vitest';
import { postMockData } from '~/mocks/data/post.mock';
import { updatePostItem } from '~/redux/reducers/post/post.reducer';
import { store } from '~/redux/store';
import { renderWithRouter, screen, waitFor, within } from '~/test.utils';
import ReactionModal from '~/Components/Post/Reactions/ReactionsModal';
import userEvent from '@testing-library/user-event';
import { PostUtils } from '~/services/utils/post-utils.service';

describe('ReactionsModal', () => {
  beforeEach(() => {
    store.dispatch(updatePostItem(postMockData));
  });

  it('should have modal wrapper', async () => {
    renderWithRouter(<ReactionModal />);

    const wrapper = screen.queryByTestId('modal-wrapper');
    const modalBg = screen.queryByTestId('modal-bg');
    const modalBody = screen.queryByTestId('modal-body');
    await waitFor(() => {
      expect(wrapper).toBeInTheDocument();
      expect(modalBg).toBeInTheDocument();
      expect(modalBody).toBeInTheDocument();
    });
  });

  it('should have list items tabs', async () => {
    let items: HTMLElement[] = [];
    renderWithRouter(<ReactionModal />);
    const listElement = screen.getByRole('list');
    const { getAllByRole } = within(listElement);
    items = getAllByRole('listitem');
    // await act(() => {});
    await waitFor(() => {
      expect(items[0].textContent).toEqual('All');
      expect(items[1].childNodes.item(0)).toHaveAttribute('src', '/src/assets/reactions/like.png');
      expect(items[1].childNodes.item(1).textContent).toEqual('1');
      expect(items[2].childNodes.item(0)).toHaveAttribute('src', '/src/assets/reactions/love.png');
      expect(items[2].childNodes.item(1).textContent).toEqual('2');
    });
  });

  it('should have reaction list items', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ReactionModal />);
    const listElement = screen.getByRole('list');
    const { getAllByRole } = within(listElement);
    const items = getAllByRole('listitem');
    await user.click(items[0]);

    await waitFor(() => {
      const reactionListElement = screen.queryAllByTestId('reaction-list');
      expect(reactionListElement.length).toEqual(PostUtils.formatReactionsCount(postMockData.reactions).length);
    });
  });
});
