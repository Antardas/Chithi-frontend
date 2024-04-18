import { describe, expect, it } from 'vitest';
import { renderWithRouter, screen } from '~/test.utils';
import userEvent from '@testing-library/user-event';
import Feelings from '.';
import ModalBoxContent from '~/Components/Post/PostModal/ModalBoxContent';

describe('Feelings', () => {
  it('should have non-empty list', () => {
    renderWithRouter(<Feelings />);
    const listElement = screen.getByRole('list');
    expect(listElement.childElementCount).toBeGreaterThan(0);
  });

  it('should handle click', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Feelings />);
    const { container } = renderWithRouter(<ModalBoxContent />);
    const listElement = screen.queryAllByTestId('feelings-item');

    await user.click(listElement[0]);
    const selectedFeelings = container.querySelector('.inline-display');
    const feelingImage = container.querySelector('.feeling-icon');
    expect(selectedFeelings).toBeInTheDocument();
    expect(feelingImage).toBeInTheDocument();
    expect(feelingImage).toHaveAttribute('src', '/src/assets/reactions/happy.png');
  });
});
