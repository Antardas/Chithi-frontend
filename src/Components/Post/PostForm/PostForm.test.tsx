import PostForm from '~/Components/Post/PostForm';
import { existingUser } from '~/mocks/data/user.mock';
import { openModal, toggleGifModal } from '~/redux/reducers/modal/modal.reducer';
import { addUser } from '~/redux/reducers/user/user.reducer';
import { store } from '~/redux/store';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, renderWithRouter, screen, waitFor, within } from '~/test.utils';

describe('PostForm', () => {
  beforeEach(() => {
    act(() => {
      store.dispatch(addUser({ token: '123456', profile: existingUser }));
    });
  });

  it('should create post text', () => {
    renderWithRouter(<PostForm />);
    const createPostText = screen.getByText(/create post/i);
    expect(createPostText).toBeInTheDocument();
  });

  it('should display avatar', async () => {
    renderWithRouter(<PostForm />);
    const inputBodyElement = await screen.findByTestId('input-body');
    expect(inputBodyElement).toBeInTheDocument();
    expect(inputBodyElement.childNodes.item(0)).toHaveAttribute('src', 'http://place-hold.it/500x500');
    expect(inputBodyElement.childNodes.item(1)).toHaveAttribute('data-placeholder', 'Write something here...');
  });

  it('should open post modal', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PostForm />);
    const inputBodyElement = await screen.findByTestId('input-body');
    await user.click(inputBodyElement);
    const postModal = await screen.findByTestId('post-modal');
    expect(postModal).toBeInTheDocument();
  });

  it('should have 3 list items', async () => {
    renderWithRouter(<PostForm />);
    const listElement = await screen.findAllByTestId('list-item');
    expect(listElement[0].childNodes.length).toEqual(3);
  });

  it('should have photo list item', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PostForm />);
    const listElement = await screen.findAllByTestId('list-item');
    const { getAllByRole } = within(listElement[0]);
    const items = getAllByRole('listitem');
    user.click(items[0]);
    const postModal = await screen.findByTestId('post-modal');
    expect(postModal).toBeInTheDocument();
    expect(items[0]).toBeInTheDocument();
    expect(items[0]?.textContent?.trim()).toEqual('Photo');
  });

  it('should have gif list item', async () => {
    const user = userEvent.setup();
    act(() => {
      store.dispatch(openModal({ type: 'add' }));
      store.dispatch(toggleGifModal(true));
    });
    renderWithRouter(<PostForm />);
    const listElement = await screen.findAllByTestId('list-item');
    const { getAllByRole } = within(listElement[0]);
    const items = getAllByRole('listitem');
    user.click(items[1]);
    const postModal = await screen.findByTestId('post-modal');
    expect(postModal).toBeInTheDocument();
    expect(items[1]).toBeInTheDocument();
    expect(items[1]?.textContent?.trim()).toEqual('Gif');
  });

  it('should have Feeling list item', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PostForm />);
    const listElement = await screen.findAllByTestId('list-item');
    const { getAllByRole } = within(listElement[0]);
    const items = getAllByRole('listitem');
    user.click(items[2]);
    const postModal = await screen.findByTestId('post-modal');
    expect(postModal).toBeInTheDocument();
    expect(items[2]).toBeInTheDocument();
    expect(items[2]?.textContent?.trim()).toEqual('Feeling');
  });
});
