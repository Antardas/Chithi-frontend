import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Register from '~/pages/auth/Register';
import { prettyDOM, renderWithRouter, screen, waitFor } from '~/test.utils';
import { existingUser } from '~/mocks/data/user.mock';
import { Utils } from '~/services/utils/utils.service';
import { server } from '~/mocks/server';
import { signupMockError } from '~/mocks/handlers/auth';
const mockedUseNavigate = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<unknown>('react-router-dom') as object),
  useNavigate: () => mockedUseNavigate
}));

describe('Register', () => {
  it("sign up form should have it's label", () => {
    renderWithRouter(<Register />);
    const emailLabel = screen.getByLabelText('Email');
    const usernameLabel = screen.getByLabelText('Username');
    const passwordLabel = screen.getByLabelText('Password');
    expect(usernameLabel).toBeInTheDocument();
    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
  });
  describe('Button', () => {
    it('should be disable', () => {
      renderWithRouter(<Register />);
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();
    });
    it('should be enable with values', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);
      const buttonElement = screen.getByRole('button', {
        name: 'Sign Up'
      });
      const emailLabel = screen.getByLabelText('Email');
      const usernameLabel = screen.getByLabelText('Username');
      const passwordLabel = screen.getByLabelText('Password');

      await user.type(emailLabel, `${existingUser.email}`);
      await user.type(usernameLabel, `${existingUser.username}`);
      await user.type(passwordLabel, `${'123456'}`);
      expect(buttonElement).toBeEnabled();
    });

    it('should be show loading text when click the button', async () => {
      vi.spyOn(Utils, 'generateAvatar').mockReturnValue('Avatar Image');
      // vi.spyOn(authService, 'singUp').mockResolvedValue({} as AxiosResponse);
      const user = userEvent.setup();

      renderWithRouter(<Register />, [
        {
          path: '/app/social/streams',
          element: <h2>Stream Page</h2>
        }
      ]);
      const buttonElement = screen.getByRole('button', {
        name: 'Sign Up'
      });
      const emailLabel = screen.getByLabelText('Email');
      const usernameLabel = screen.getByLabelText('Username');
      const passwordLabel = screen.getByLabelText('Password');

      await user.type(emailLabel, `${existingUser.email}`);
      await user.type(usernameLabel, `${existingUser.username}`);
      await user.type(passwordLabel, `${'123456'}`);
      user.click(buttonElement);

      await waitFor(() => {
        const newButtonElement = screen.getByRole('button');
        expect(newButtonElement.textContent).toEqual('Sign Up in Progress');
      });
    });
  });

  describe('Success', () => {
    it('should navigate to the stream page', async () => {
      vi.spyOn(Utils, 'generateAvatar').mockReturnValue('Avatar Image');
      // vi.spyOn(authService, 'singUp').mockResolvedValue({} as AxiosResponse);
      const user = userEvent.setup();
      renderWithRouter(<Register />);
      const buttonElement = screen.getByRole('button', {
        name: 'Sign Up'
      });
      const emailLabel = screen.getByLabelText('Email');
      const usernameLabel = screen.getByLabelText('Username');
      const passwordLabel = screen.getByLabelText('Password');

      await user.type(emailLabel, `${existingUser.email}`);
      await user.type(usernameLabel, `${existingUser.username}`);
      await user.type(passwordLabel, `${'123456'}`);
      user.click(buttonElement);

      await waitFor(() => {
        expect(mockedUseNavigate).toHaveBeenCalledWith('/app/social/streams');
      });
    });
  });

  describe('Error', () => {
    it('should display error alert and border', async () => {
      server.use(signupMockError);
      vi.spyOn(Utils, 'generateAvatar').mockReturnValue('Avatar Image');
      // vi.spyOn(authService, 'singUp').mockResolvedValue({} as AxiosResponse);
      const user = userEvent.setup();
      renderWithRouter(<Register />);
      const buttonElement = screen.getByRole('button', {
        name: 'Sign Up'
      });
      const emailLabel = screen.getByLabelText('Email');
      const usernameLabel = screen.getByLabelText('Username');
      const passwordLabel = screen.getByLabelText('Password');

      await user.type(emailLabel, `${existingUser.email}`);
      await user.type(usernameLabel, `${existingUser.username}`);
      await user.type(passwordLabel, `${'123456'}`);
      await user.click(buttonElement);

      const alertElement = await screen.findByRole('alert');
      console.log(prettyDOM(alertElement));
      expect(alertElement).toBeInTheDocument();
      expect(alertElement.textContent).toEqual('Invalid Credentials');
      await waitFor(async () => {
        expect(usernameLabel).toHaveStyle({
          border: '1px solid #fa9b8a'
        });
        expect(passwordLabel).toHaveStyle({
          border: '1px solid #fa9b8a'
        });
        expect(emailLabel).toHaveStyle({
          border: '1px solid #fa9b8a'
        });
      });
    });
  });
});
