import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithRouter, screen, waitFor } from '~/test.utils';
import { Login } from '~/pages/auth';
import userEvent from '@testing-library/user-event';
import { existingUser } from '~/mocks/data/user.mock';
import { server } from '~/mocks/server';
import { signInMockError } from '~/mocks/handlers/auth';

const mockedUseNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual<unknown>('react-router-dom')) as object),
  useNavigate: () => mockedUseNavigate
}));
describe('SignIn', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Input', () => {
    it('should have the form labels ', () => {
      renderWithRouter(<Login />);
      const usernameLabel = screen.getByLabelText('Username');
      const passwordLabel = screen.getByLabelText('Password');
      const checkBoxLabel = screen.getByLabelText('Keep me signed in');
      expect(usernameLabel).toBeInTheDocument();
      expect(passwordLabel).toBeInTheDocument();
      expect(checkBoxLabel).toBeInTheDocument();
    });
    it('should checkbox uncheck ', () => {
      renderWithRouter(<Login />);
      const checkBoxLabel = screen.getByLabelText('Keep me signed in');
      expect(checkBoxLabel).not.toBeChecked();
    });
    it('should checkbox checked after click ', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);
      const checkBoxLabel = screen.getByLabelText('Keep me signed in');
      expect(checkBoxLabel).not.toBeChecked();
      await user.click(checkBoxLabel);
      expect(checkBoxLabel).toBeChecked();
    });
  });

  describe('Button', () => {
    it('should be disabled ', () => {
      renderWithRouter(<Login />);

      const buttonElement = screen.getByRole('button');

      expect(buttonElement).toBeDisabled();
    });
    it('should have the form labels ', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);
      const usernameLabel = screen.getByLabelText('Username');
      const passwordLabel = screen.getByLabelText('Password');
      const buttonElement = screen.getByRole('button');

      await user.type(usernameLabel, `${existingUser.username}`);
      await user.type(passwordLabel, `${'123456'}`);
      expect(buttonElement).toBeEnabled();
    });

    it('should change button text when click', async () => {
      const user = userEvent.setup();

      renderWithRouter(<Login />);
      const usernameLabel = screen.getByLabelText('Username');
      const passwordLabel = screen.getByLabelText('Password');
      const buttonElement = screen.getByRole('button');

      await user.type(usernameLabel, `${existingUser.username}`);
      await user.type(passwordLabel, `${'123456'}`);
      user.click(buttonElement);

      await waitFor(() => {
        const newButtonElement = screen.getByRole('button');
        expect(newButtonElement.textContent).toEqual('Login in progress');
      });
    });
  });

  describe('Success', () => {
    it('should navigate to stream page', async () => {
      const user = userEvent.setup();

      renderWithRouter(<Login />);
      const usernameLabel = screen.getByLabelText('Username');
      const passwordLabel = screen.getByLabelText('Password');
      const buttonElement = screen.getByRole('button');

      await user.type(usernameLabel, `${existingUser.username}`);
      await user.type(passwordLabel, `${'123456'}`);
      await user.click(buttonElement);

      expect(mockedUseNavigate).toHaveBeenCalledWith('/app/social/streams');
    });
  });

  describe('Error', () => {
    it('should navigate to stream page', async () => {
      const user = userEvent.setup();
      server.use(signInMockError);

      renderWithRouter(<Login />);
      const usernameLabel = screen.getByLabelText('Username');
      const passwordLabel = screen.getByLabelText('Password');
      const buttonElement = screen.getByRole('button');

      await user.type(usernameLabel, `${existingUser.username}`);
      await user.type(passwordLabel, `${'123456'}`);
      user.click(buttonElement);

      const alertElement: HTMLElement = await screen.findByRole('alert');
      expect(alertElement.textContent).toEqual('username and password wrong');
      expect(alertElement).toBeInTheDocument();
      expect(usernameLabel).toHaveStyle({
        border: '1px solid #fa9b8a'
      });
      expect(passwordLabel).toHaveStyle({
        border: '1px solid #fa9b8a'
      });
    });
  });
});
