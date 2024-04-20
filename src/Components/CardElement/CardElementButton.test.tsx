import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '~/test.utils';
import userEvent from '@testing-library/user-event';
import CardElementButton from '~/Components/CardElement/CardElementButton';
const user = userEvent.setup();
describe('CardElementButtons', () => {
  it('should display two buttons', () => {
    const props = {
      isChecked: false,
      btnTextOne: 'Button 1',
      btnTextTwo: 'Button 2',
      onClickBtnOne: () => {},
      onClickBtnTwo: () => {},
      navigateToProfile: () => {}
    };
    render(<CardElementButton {...props} />);
    const buttonElements = screen.queryAllByRole('button');
    const buttonOne = screen.getByText('Button 1');
    const buttonTwo = screen.getByText('Profile');
    expect(buttonElements.length).toEqual(2);
    expect(buttonOne).toBeInTheDocument();
    expect(buttonTwo).toBeInTheDocument();
  });

  it('should handle clicks', async () => {
    const buttonOneClick = vi.fn();
    const profileButtonClick = vi.fn();
    const props = {
      isChecked: false,
      btnTextOne: 'Button 1',
      btnTextTwo: 'Button 2',
      onClickBtnOne: buttonOneClick,
      onClickBtnTwo: () => {},
      navigateToProfile: profileButtonClick
    };
    render(<CardElementButton {...props} />);
    const buttonElements = screen.queryAllByRole('button');
    await user.click(buttonElements[0]);
    await user.click(buttonElements[1]);
    expect(buttonOneClick).toHaveBeenCalledTimes(1);
    expect(profileButtonClick).toHaveBeenCalledTimes(1);
  });

  it('should handle button 2 click', async () => {
    const buttonOneClick = vi.fn();
    const props = {
      btnTextOne: 'Button 1',
      btnTextTwo: 'Button 2',
      onClickBtnTwo: buttonOneClick,
      onClickBtnOne: () => {},
      navigateToProfile: () => {},
      isChecked: true
    };
    const { rerender } = render(<CardElementButton {...props} />);
    rerender(<CardElementButton {...props} isChecked={true}  />);
    const buttonElements = screen.queryAllByRole('button');
    await user.click(buttonElements[0]);
    expect(buttonElements[0].textContent).toEqual('Button 2');
    expect(buttonOneClick).toHaveBeenCalledTimes(1);
  });
});
