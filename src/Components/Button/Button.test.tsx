import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/test.utils';
import Button from '~/Components/Button';
import userEvent from '@testing-library/user-event';
describe('Button', () => {
  it('should be disabled', () => {
    render(<Button label="Send" disabled={true} className="button" />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });
  it('should be enabled', () => {
    render(<Button label="Send" disabled={false} className="button" />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeEnabled();
  });
  it('should have label', () => {
    render(<Button label="Send" disabled={false} className="button" />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement.textContent).toEqual('Send');
  });
  it('should have handleClick', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button label="Send" disabled={false} className="button" handleClick={handleClick} />);
    const buttonElement = screen.getByRole('button');
    await user.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
