/**
 * NOTE => https://onestepcode.com/testing-library-user-event-with-fake-timers/
 *
 */

import { editPostMockData } from '~/mocks/data/post.mock';
import { existingUser } from '~/mocks/data/user.mock';
import { updatePostItem } from '~/redux/reducers/post/post.reducer';
import { addUser } from '~/redux/reducers/user/user.reducer';
import { store } from '~/redux/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, prettyDOM, renderWithRouter, screen } from '~/test.utils';
import userEvent from '@testing-library/user-event';
import EditPost from '~/Components/Post/PostModal/EditPost';
describe('EditPost', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    store.dispatch(updatePostItem(editPostMockData));
    store.dispatch(addUser({ token: '123456', profile: existingUser }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    editPostMockData.gifUrl = '';
    vi.clearAllTimers();
  });

  it('should display have edit post text', async () => {
    renderWithRouter(<EditPost />);
    const editPostHeader = await screen.findByText(/edit post/i);
    expect(editPostHeader).toBeInTheDocument();
  });

  it('should display modal box content', async () => {
    renderWithRouter(<EditPost />);
    const modalBoxContent = await screen.findByTestId('modal-box-content');
    expect(modalBoxContent).toBeInTheDocument();
  });

  it('should have background colors for selection', async () => {
    renderWithRouter(<EditPost />);
    const bgColors = await screen.findAllByTestId('bg-colors');
    bgColors.forEach((color) => expect(color).toBeInTheDocument());
  });

  it('should automatically set background color of modal box form', async () => {
    renderWithRouter(<EditPost />);
    const modalBoxForm = await screen.findByTestId('modal-box-form');
    expect(modalBoxForm).toHaveStyle({ background: 'rgb(244, 67, 54)' });
  });

  it('should change background color of modal box form to default', async () => {
    renderWithRouter(<EditPost />);
    const bgColors = await screen.findAllByTestId('bg-colors');
    const modalBoxForm = await screen.findByTestId('modal-box-form');
    userEvent.click(bgColors[0]);
    expect(modalBoxForm).toHaveStyle({ background: 'rgb(244, 67, 54)' });
  });

  it('should have post input contenteditable and have focus', async () => {
    renderWithRouter(<EditPost />);
    const editableElement = await screen.findByTestId('editable');
    expect(editableElement).toHaveAttribute('contentEditable', 'true');
    expect(editableElement).toHaveFocus();
  });

  it('should have post displayed', async () => {
    renderWithRouter(<EditPost />);

    vi.runAllTimers();
    const editableElement = await screen.findByTestId('editable');
    expect(editableElement.textContent).toEqual(editPostMockData.post);
  });

  it('should display image', async () => {
    editPostMockData.gifUrl = 'https://place-hold.it/500x500';
    store.dispatch(updatePostItem(editPostMockData));
    renderWithRouter(<EditPost />);
    const postEditableInput = await screen.findByTestId('post-editable');
    const postImage = await screen.findByTestId('post-image');
    expect(postImage).toHaveAttribute('src', 'https://place-hold.it/500x500');
    expect(postEditableInput).toHaveFocus();
  });

  it('should remove image', async () => {
    const user = userEvent.setup({ delay: null });
    editPostMockData.gifUrl = 'https://place-hold.it/500x500';
    store.dispatch(updatePostItem(editPostMockData));

    renderWithRouter(<EditPost />);
    const imageDeleteBtn = await screen.findByTestId('image-delete-btn');
    const postImage = await screen.findByTestId('post-image');
    expect(postImage).toHaveAttribute('src', 'https://place-hold.it/500x500');
    await user.click(imageDeleteBtn);
    const samePostImage = screen.queryByTestId('post-image');
    expect(samePostImage).not.toBeInTheDocument();
  });

  it('should changed allowed number of characters', async () => {
    const user = userEvent.setup({ delay: null });
    const post = 'this is a good day.';
    renderWithRouter(<EditPost />);
    const editableElement = await screen.findByTestId('editable');
    await user.type(editableElement, `${post}`);
    const fullPostLength = `${editPostMockData.post}${post}`.length;
    const allowedNumberOfCharacters = await screen.findByTestId('allowed-number');
    expect(allowedNumberOfCharacters.textContent).toEqual(`${100 - fullPostLength}/100`);
  });

  it('should display modal box selection', async () => {
    renderWithRouter(<EditPost />);
    const modalBoxSelection = await screen.findByTestId('modal-box-selection');
    expect(modalBoxSelection).toBeInTheDocument();
  });

  it('should have update post button', async () => {
    renderWithRouter(<EditPost />);
    const buttonElement = await screen.findByTestId('edit-button');
    expect(buttonElement.childNodes.item(0)).toBeInTheDocument();
  });
});
