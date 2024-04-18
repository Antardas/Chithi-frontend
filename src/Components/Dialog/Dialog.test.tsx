import Dialog, { DialogProps } from '~/Components/Dialog';
import { render, screen } from '~/test.utils';
import userEvent from '@testing-library/user-event';

import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Dialog', () => {
  let props: DialogProps;
  const buttonOneClick = vi.fn();
  const buttonTwoClick = vi.fn();
  beforeEach(() => {
    props = {
      title: 'Dialog text',
      firstButtonText: 'Button 1',
      secondButtonText: 'Button 2',
      firstBtnHandler: buttonOneClick,
      secondBtnHandler: buttonTwoClick
    };
  });

  it('should display its elements', () => {
    render(<Dialog {...props} />);
    const title = screen.getByText('Dialog text');
    const buttonOne = screen.getByText('Button 1');
    const buttonTwo = screen.getByText('Button 2');
    expect(title).toBeInTheDocument();
    expect(buttonOne).toBeInTheDocument();
    expect(buttonTwo).toBeInTheDocument();
  });

  it('should handle click', async () => {
    const user = userEvent.setup();
    render(<Dialog {...props} />);
    const buttonOne = screen.getByText('Button 1');
    const buttonTwo = screen.getByText('Button 2');
    await user.click(buttonOne);
    await user.click(buttonTwo);
    expect(buttonOneClick).toHaveBeenCalledTimes(1);
    expect(buttonTwoClick).toHaveBeenCalledTimes(1);
  });
});
