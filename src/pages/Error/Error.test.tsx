import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import Error from '~/pages/Error';
import { renderWithRouter, screen } from '~/test.utils';

const mockedUseNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...((await vi.importActual<unknown>('react-router-dom')) as object),
  useNavigate: () => mockedUseNavigate
}));
describe('Error', () => {
  test('page should have its texts', () => {
    renderWithRouter(<Error />);
    const oopsText = screen.getByText(/oops/i);
    const error404Text = screen.getByText(/error 404/i);
    const backHomeText = screen.getByText(/back home/i);
    expect(oopsText).toBeInTheDocument();
    expect(error404Text).toBeInTheDocument();
    expect(backHomeText).toBeInTheDocument();
  });

  test('page should have a button', () => {
    renderWithRouter(<Error />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeEnabled();
  });
  test('navigate should call have been with -1', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Error />);
    const buttonElement = screen.getByRole('button');
    await user.click(buttonElement);
    expect(mockedUseNavigate).toHaveBeenCalledWith(-1);
  });
});
