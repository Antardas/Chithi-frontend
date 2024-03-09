import userEvent from '@testing-library/user-event';
import { MemoryRouter, createSearchParams } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { resetPasswordMockError } from '~/mocks/handlers/auth';
import { server } from '~/mocks/server';
import { ResetPassword } from '~/pages/auth';
import { render, renderWithRouter, screen, waitFor } from '~/test.utils';

describe('ResetPassword', () => {
  beforeEach(() => {});

  it('should have password inputs', () => {
    renderWithRouter(<ResetPassword />);
    const newPasswordLabel = screen.getByLabelText('New Password');
    const confirmPasswordLabel = screen.getByLabelText('Confirm Password');
    expect(newPasswordLabel).toBeInTheDocument();
    expect(confirmPasswordLabel).toBeInTheDocument();
  });

  it('button should be disabled', () => {
    renderWithRouter(<ResetPassword />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });

  it('should have "Back to Login" text', () => {
    renderWithRouter(<ResetPassword />);
    const spanElement = screen.getByText('Back to Login');
    expect(spanElement).toBeInTheDocument();
  });

  it('should be enabled with input', async () => {
    const url = `/reset-password?${createSearchParams({
      token: '1234567890'
    })}`;

    const user = userEvent.setup();
    // renderWithRouter(<ResetPassword />);

    // Act
    render(
      <MemoryRouter initialEntries={[url]}>
        <ResetPassword />
      </MemoryRouter>
    );

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();

    const newPasswordLabel = screen.getByLabelText('New Password');
    const confirmPasswordLabel = screen.getByLabelText('Confirm Password');
    await user.type(newPasswordLabel, 'qwerty1');
    await user.type(confirmPasswordLabel, 'qwerty1');
    expect(buttonElement).toBeEnabled();
  });

  it('should change label when clicked', async () => {
    const url = `/reset-password?${createSearchParams({
      token: '1234567890'
    })}`;

    const user = userEvent.setup();
    // renderWithRouter(<ResetPassword />);

    // Act
    render(
      <MemoryRouter initialEntries={[url]}>
        <ResetPassword />
      </MemoryRouter>
    );
    const buttonElement = screen.getByRole('button');
    const newPasswordLabel = screen.getByLabelText('New Password');
    const confirmPasswordLabel = screen.getByLabelText('Confirm Password');
    await user.type(newPasswordLabel, 'qwerty1');
    await user.type(confirmPasswordLabel, 'qwerty1');
    user.click(buttonElement);
    await waitFor(async () => {
      const newButtonElement = screen.getByRole('button');
      expect(newButtonElement.textContent).toEqual('RESET PASSWORD in progress');
    });
    expect(buttonElement.textContent).toEqual('RESET PASSWORD');
  });

  describe('Success', () => {
    it('should display success alert', async () => {
      const url = `/reset-password?${createSearchParams({
        token: '1234567890'
      })}`;

      const user = userEvent.setup();

      // Act
      render(
        <MemoryRouter initialEntries={[url]}>
          <ResetPassword />
        </MemoryRouter>
      );
      const buttonElement = screen.getByRole('button');
      const newPasswordLabel = screen.getByLabelText('New Password');
      const confirmPasswordLabel = screen.getByLabelText('Confirm Password');
      await user.type(newPasswordLabel, 'qwerty1');
      await user.type(confirmPasswordLabel, 'qwerty1');
      await user.click(buttonElement);

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-success');
      expect(alert.textContent).toEqual('Password successfully updated.');
    });
  });

  describe('Error', () => {
    it('should display error alert and border', async () => {
      server.use(resetPasswordMockError);
      const url = `/reset-password?${createSearchParams({
        token: '1234567890'
      })}`;

      const user = userEvent.setup();

      // Act
      render(
        <MemoryRouter initialEntries={[url]}>
          <ResetPassword />
        </MemoryRouter>
      );
      const buttonElement = screen.getByRole('button');
      const newPasswordLabel = screen.getByLabelText('New Password');
      const confirmPasswordLabel = screen.getByLabelText('Confirm Password');
      await user.type(newPasswordLabel, 'qwerty1');
      await user.type(confirmPasswordLabel, 'qwerty1');
      await user.click(buttonElement);

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-error');
      expect(alert.textContent).toEqual('Reset Token has expired');
    });
  });
});
