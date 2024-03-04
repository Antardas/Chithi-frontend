import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Register from '~/pages/auth/Register';
import { renderWithRouter, screen } from '~/test.utils';
describe('Register', () => {
  it("signup form should have it's label", () => {
    renderWithRouter(<Register />);
    screen.debug();
    const emailLabel = screen.getByLabelText('Email');
    const usernameLabel = screen.getByLabelText('Username');
    const passwordLabel = screen.getByLabelText('Password');
    expect(usernameLabel).toBeInTheDocument();
    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
  });
});
