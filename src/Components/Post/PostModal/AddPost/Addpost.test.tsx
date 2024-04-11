import AddPost from '~/Components/Post/PostModal/AddPost';
import { postMockData } from '~/mocks/data/post.mock';
import { existingUser } from '~/mocks/data/user.mock';
import { updatePostItem } from '~/redux/reducers/post/post.reducer';
import { addUser } from '~/redux/reducers/user/user.reducer';
import { store } from '~/redux/store';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, renderWithRouter, screen } from '~/test.utils';
import userEvent from '@testing-library/user-event';
const fileObject = {} as File;
describe('AddPost', () => {
  beforeEach(() => {
    act(() => {
      store.dispatch(updatePostItem(postMockData));
      store.dispatch(addUser({ token: '123456', profile: existingUser }));
    });
  });

  afterEach(() => {
    postMockData.gifUrl = '';
  });

  it('should display modal box content', async () => {
    renderWithRouter(<AddPost selectedImage={fileObject} />);
    const modalBoxContent = await screen.findByTestId('modal-box-content');
    expect(modalBoxContent).toBeInTheDocument();
  });

  it('should display modal box form with white background', async () => {
    renderWithRouter(<AddPost selectedImage={fileObject} />);
    const modalBoxForm = await screen.findByTestId('modal-box-form');
    expect(modalBoxForm).toBeInTheDocument();
    expect(modalBoxForm).toHaveStyle({ background: 'rgb(255, 255, 255)' });
  });

  it('should have background colors for selection', async () => {
    renderWithRouter(<AddPost selectedImage={fileObject} />);
    const bgColors = await screen.findAllByTestId('bg-colors');
    bgColors.forEach((color) => expect(color).toBeInTheDocument());
  });

  it('should change background color of modal box form', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AddPost selectedImage={fileObject} />);
    const bgColors = await screen.findAllByTestId('bg-colors');
    const modalBoxForm = await screen.findByTestId('modal-box-form');
    user.click(bgColors[1]);
    expect(modalBoxForm).toHaveStyle({ background: 'rgb(255, 255, 255)' });
  });

  it('should have post input contenteditable and have focus', async () => {
    renderWithRouter(<AddPost selectedImage={fileObject} />);
    const editableElement = await screen.findByTestId('editable');
    expect(editableElement).toHaveAttribute('contentEditable', 'true');
    expect(editableElement).toHaveFocus();
  });

  it('should display post and image', async () => {
    postMockData.gifUrl = 'https://place-hold.it/500x500';
    act(() => {
      store.dispatch(updatePostItem(postMockData));
    });
    renderWithRouter(<AddPost selectedImage={fileObject} />);
    const postEditableInput = await screen.findByTestId('post-editable');
    const postImage = await screen.findByTestId('post-image');
    postEditableInput.textContent = 'testing';
    expect(postImage).toHaveAttribute('src', 'https://place-hold.it/500x500');
    expect(postEditableInput).toHaveFocus();
    expect(postEditableInput.textContent).toEqual('testing');
  });

  it('should remove image', async () => {
    const user = userEvent.setup();
    postMockData.gifUrl = 'https://place-hold.it/500x500';
    await act(async () => {
      store.dispatch(updatePostItem(postMockData));
      renderWithRouter(<AddPost selectedImage={fileObject} />);
    });
    const imageDeleteBtn = await screen.findByTestId('image-delete-btn');
    const postImage = await screen.findByTestId('post-image');
    expect(postImage).toHaveAttribute('src', 'https://place-hold.it/500x500');
    await user.click(imageDeleteBtn);
    const samePostImage = screen.queryByTestId('post-image');
    expect(samePostImage).not.toBeInTheDocument();
  });

  it('should display default allowed number of characters', async () => {
    renderWithRouter(<AddPost selectedImage={fileObject} />);
    const allowedNumberOfCharacters = await screen.findByTestId('allowed-number');
    expect(allowedNumberOfCharacters.textContent).toEqual('100/100');
  });

  it('should changed allowed number of characters', async () => {
    const user = userEvent.setup();
    const post = 'this is a good day.';
    renderWithRouter(<AddPost selectedImage={fileObject} />);
    const editableElement = await screen.findByTestId('editable');
    await user.type(editableElement, post);
    const allowedNumberOfCharacters = await screen.findByTestId('allowed-number');
    expect(allowedNumberOfCharacters.textContent).toEqual(`${100 - post.length}/100`);
  });

  it('should display modal box selection', async () => {
    renderWithRouter(<AddPost selectedImage={fileObject} />);
    const modalBoxSelection = await screen.findByTestId('modal-box-selection');
    expect(modalBoxSelection).toBeInTheDocument();
  });

  it('should have post button', async () => {
    postMockData.post = '';
    act(() => {
      store.dispatch(updatePostItem(postMockData));
    });
    renderWithRouter(<AddPost selectedImage={fileObject} />);
    const buttonElement = await screen.findByTestId('post-button');
    expect(buttonElement.childNodes.item(0)).toBeInTheDocument();
  });
});
