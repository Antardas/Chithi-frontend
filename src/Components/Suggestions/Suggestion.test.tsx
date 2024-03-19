import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import Suggestion from '~/Components/Suggestions';
import { addToSuggestion } from '~/redux/reducers/suggestion/suggestion.reducer';
import { store } from '~/redux/store';
import { Utils } from '~/services/utils/utils.service';
import { renderWithRouter, screen } from '~/test.utils';

const user = {
  _id: '12345',
  uId: 23456,
  username: 'Sunny',
  email: 'sunny@test.com',
  avatarColor: 'red',
  postsCount: 2,
  work: '',
  school: '',
  quote: '',
  location: '',
  blocked: [],
  blockedBy: [],
  followersCount: 1,
  followingCount: 1,
  notifications: null,
  social: null,
  createdAt: '2022-06-15',
  bgImageVersion: '',
  bgImageId: '',
  profilePicture: ''
};

const mockedUseNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual<unknown>('react-router-dom')) as object),
  useNavigate: () => mockedUseNavigate
}));

describe('Suggestions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should have item in list', async () => {
    const userOne = { ...user };
    user._id = Utils.generateString(8);
    const userTwo = { ...user };
    user._id = Utils.generateString(6);
    const userThree = { ...user };
    store.dispatch(addToSuggestion({ users: [userOne, userTwo, userThree], isLoading: false }));
    renderWithRouter(<Suggestion />);

    const items = screen.queryAllByTestId('suggestions-item');
    expect(items.length).toEqual(3);
  });
  it('should display view more', async () => {
    const users = [];
    for (let i = 0; i < 10; i++) {
      user._id = Utils.generateString(10);
      users.push({ ...user });
    }
    store.dispatch(addToSuggestion({ users: users, isLoading: false }));
    const { baseElement } = renderWithRouter(<Suggestion />);

    const items = screen.queryAllByTestId('suggestions-item');
    const viewMore = baseElement.querySelector('.view-more');
    expect(items.length).toEqual(10);
    expect(viewMore).toBeInTheDocument();
  });
  it('should change the url click click view more', async () => {
    const event = userEvent.setup();
    const users = [];
    for (let i = 0; i < 10; i++) {
      user._id = Utils.generateString(10);
      users.push({ ...user });
    }
    store.dispatch(addToSuggestion({ users: users, isLoading: false }));
    const { baseElement } = renderWithRouter(<Suggestion />, [
      {
        path: '/app/social/people',
        element: <div>People</div>
      }
    ]);

    const viewMore = baseElement.querySelector('.view-more');
    expect(viewMore).toBeInTheDocument();
    await event.click(viewMore as Element);
    expect(mockedUseNavigate).toHaveBeenCalledWith('/app/social/people');
  });
});
