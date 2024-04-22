import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GalleryImage, { IGalleryImageProps } from '.';
import { renderWithRouter, screen } from '~/test.utils';
import { postMockData } from '~/mocks/data/post.mock';

const user = userEvent.setup();

describe('GalleryImage', () => {
  let props: IGalleryImageProps;
  beforeEach(() => {
    props = {
      post: postMockData,
      showCaption: false,
      showDelete: false,
      imgSrc: 'https://place-hold.it',
      onClick: () => {},
      // onRemoveImage: null
    };
  });

  it('should show image with no caption', () => {
    renderWithRouter(<GalleryImage {...props} />);
    const imgElement = screen.getByRole('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'https://place-hold.it');
  });

  it('should show delete icon', async () => {
    const onRemoveClick = vi.fn();
    props.showDelete = true;
    props.onRemoveImage = onRemoveClick;
    const { baseElement } = renderWithRouter(<GalleryImage {...props} />);
    const spanElement = baseElement.querySelector('.gallery-image__delete');
    await user.click(spanElement as HTMLElement);
    expect(spanElement).toBeInTheDocument();
    expect(onRemoveClick).toHaveBeenCalledTimes(1);
  });

  it('should show image caption', () => {
    props.showCaption = true;
    const { baseElement } = renderWithRouter(<GalleryImage {...props} />);
    const figureElement = baseElement.querySelector('.gallery-image__caption');
    const figureTitleElement = baseElement.querySelector('.figure-title');
    const figureDateElement = baseElement.querySelector('.figure-date');
    expect(figureElement).toBeInTheDocument();
    expect(figureTitleElement).toBeInTheDocument();
    expect(figureDateElement).toBeInTheDocument();
  });
});
