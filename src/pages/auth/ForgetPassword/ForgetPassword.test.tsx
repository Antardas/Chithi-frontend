import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithRouter, screen, waitFor } from '~/test.utils';
import { ForgetPassword } from '~/pages/auth';
import userEvent from '@testing-library/user-event';
import { existingUser } from '~/mocks/data/user.mock';
import { server } from '~/mocks/server';
import { forgetPasswordMockError } from '~/mocks/handlers/auth';

const mockedUseNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual<unknown>('react-router-dom')) as object),
  useNavigate: () => mockedUseNavigate
}));

describe('ForgetPassword', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('form should have email label', () => {
    renderWithRouter(<ForgetPassword />);
    const emailLabel = screen.getByLabelText('Email');
    expect(emailLabel).toBeInTheDocument();
  });

  it('should have "Back to Login" text', () => {
    renderWithRouter(<ForgetPassword />);
    const spanElement = screen.getByText('Back to Login');
    expect(spanElement).toBeInTheDocument();
  });

  describe('Button', () => {
    it('button should be disabled', () => {
      renderWithRouter(<ForgetPassword />);
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();
    });

    it('should be enabled with input', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ForgetPassword />);
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();

      const emailElement = screen.getByLabelText('Email');
      await user.type(emailElement, `${existingUser.email}`);
      expect(buttonElement).toBeEnabled();
    });

    it('should change label when clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ForgetPassword />);
      const buttonElement = screen.getByRole('button');
      const emailElement = screen.getByLabelText('Email');
      await user.type(emailElement, `${existingUser.email}`);
      user.click(buttonElement);

      await waitFor(() => {
        const newButtonElement = screen.getByRole('button');
        expect(newButtonElement.textContent).toEqual('Forget Password in progress');
      });

      await waitFor(() => {
        const newButtonElement1 = screen.getByRole('button');
        expect(newButtonElement1.textContent).toEqual('Forget Password');
      });
    });
  });

  describe('Success', () => {
    it('should display success alert', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ForgetPassword />);
      const buttonElement = screen.getByRole('button');
      const emailElement = screen.getByLabelText('Email');
      await user.type(emailElement, `${existingUser.email}`);
      await user.click(buttonElement);

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-success');
      expect(alert.textContent).toEqual('Email Send Successfully');
    });
  });

  describe('Error', () => {
    it('should display error alert and border', async () => {
      const user = userEvent.setup();
      server.use(forgetPasswordMockError);
      renderWithRouter(<ForgetPassword />);
      const buttonElement = screen.getByRole('button');
      const emailElement = screen.getByLabelText('Email');
      await user.type(emailElement, `${existingUser.email}`);
      await user.click(buttonElement);

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      await waitFor(() => expect(emailElement).toHaveStyle({ border: '1px solid #fa9b8a' }));
      expect(alert).toHaveClass('alert-error');
      expect(alert.textContent).toEqual('Field must be valid');
    });
  });
});
