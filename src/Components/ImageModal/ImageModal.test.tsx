import { render, screen } from '~/test.utils';
import userEvent from '@testing-library/user-event';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import ImageModal, { ImageModalProps } from '~/Components/ImageModal';
describe('ImageModal', () => {
  let props: ImageModalProps;
  beforeEach(() => {
    props = {
      image: 'https://place-hold.it',
      onCancel: vi.fn(),
      onClickLeft: vi.fn(),
      onClickRight: vi.fn(),
      showArrow: false,
      lastItemRight: false,
      lastItemLeft: false
    };
  });
  it('should display image', () => {
    render(<ImageModal {...props} />);
    const imgElement = screen.getByRole('img');
    expect(imgElement).toBeInTheDocument();
  });

  it('should display left and right arrows', () => {
    props.showArrow = true;
    const { baseElement } = render(<ImageModal {...props} />);
    const leftArrowElement = baseElement.querySelector('.image-modal-icon-left');
    const rightArrowElement = baseElement.querySelector('.image-modal-icon-right');
    expect(leftArrowElement).toBeInTheDocument();
    expect(rightArrowElement).toBeInTheDocument();
  });
});
