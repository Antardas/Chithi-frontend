import { act, prettyDOM, renderWithRouter, screen, waitFor } from '~/test.utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { postComment, postMockData, postReactionOne } from '~/mocks/data/post.mock';

import { store } from '~/redux/store';
import { updatePostItem } from '~/redux/reducers/post/post.reducer';
import CommentsModal from '~/Components/Post/Comments/CommentsModal';
import { postService } from '~/services/api/post/post.service';
import { AxiosResponse } from 'axios';

describe('CommentsModal', () => {
  beforeEach(() => {
    act(() => {
      store.dispatch(updatePostItem(postMockData));
    });
  });

  it('should have modal wrapper', async () => {
    renderWithRouter(<CommentsModal />);

    const wrapper = screen.queryByTestId('modal-wrapper');
    const modalBg = screen.queryByTestId('modal-bg');
    const modalBody = screen.queryByTestId('modal-body');
    // await act(() => {
    // });
    await waitFor(() => {
      expect(wrapper).toBeInTheDocument();
      expect(modalBg).toBeInTheDocument();
      expect(modalBody).toBeInTheDocument();
    });
  });

  it('should title comments', async () => {
    renderWithRouter(<CommentsModal />);
    const title = screen.queryByText(/comments/i) as HTMLElement;
    await waitFor(() => {
      expect(title).toBeInTheDocument();
      expect(title.textContent).toEqual('Comments');
    });
  });

  it('should have comments', async () => {

    const { baseElement } = renderWithRouter(<CommentsModal />);
    const listItems = await screen.findAllByTestId('modal-list-item');
    console.log(prettyDOM(baseElement));
    const h1 = baseElement.querySelector('h1') as HTMLElement;
    const comment = baseElement.querySelector('p') as HTMLElement;
    expect(listItems.length).toEqual(1);
    expect(listItems[0]).toBeInTheDocument();
    expect(h1.textContent).toEqual(postMockData.username);
    expect(comment.textContent).toEqual(postComment.comment);
  });
});
