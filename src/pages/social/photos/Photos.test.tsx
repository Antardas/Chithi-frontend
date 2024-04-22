import { describe, expect, it, vi } from 'vitest';
import { emptyPostsWithImagesMock } from '~/mocks/handlers/post';
import { server } from '~/mocks/server';
import Photos from '.';
import { renderWithRouter, screen } from '~/test.utils';
import { Utils } from '~/services/utils/utils.service';
import { PostUtils } from '~/services/utils/post-utils.service';

describe('Photos', () => {
  it('should display empty message', async () => {
    server.use(emptyPostsWithImagesMock);
    renderWithRouter(<Photos />);
    const cardElementItems = screen.queryByTestId('gallery-images');
    const emptyPage = await screen.findByTestId('empty-page');
    expect(cardElementItems?.childElementCount).toBe(0);
    expect(emptyPage).toBeInTheDocument();
    expect(emptyPage.textContent).toEqual('There are no photos to display');
  });

  it('should have 1 image', async () => {
    renderWithRouter(<Photos />);
    const cardElementItems = await screen.findAllByTestId('gallery-images');
    expect(cardElementItems.length).toEqual(1);
    expect(cardElementItems[0]).toBeInTheDocument();
  });

  it('should have gallery image if user is not blocked', async () => {
    vi.spyOn(Utils, 'checkIfUserIsBlocked').mockReturnValue(false);
    vi.spyOn(PostUtils, 'checkPrivacy').mockReturnValue(true);
    renderWithRouter(<Photos />);
    const cardElementItems = await screen.findAllByTestId('gallery');
    expect(cardElementItems.length).toEqual(1);
    expect(cardElementItems[0]).toBeInTheDocument();
  });

  it('should have gallery image if image is public', async () => {
    vi.spyOn(Utils, 'checkIfUserIsBlocked').mockReturnValue(false);
    vi.spyOn(PostUtils, 'checkPrivacy').mockReturnValue(true);
    renderWithRouter(<Photos />);
    const cardElementItems = await screen.findAllByTestId('gallery');
    expect(cardElementItems.length).toEqual(1);
    expect(cardElementItems[0]).toBeInTheDocument();
  });

  it('should not have gallery image if image is private', async () => {
    vi.spyOn(Utils, 'checkIfUserIsBlocked').mockReturnValue(false);
    vi.spyOn(PostUtils, 'checkPrivacy').mockReturnValue(false);
    renderWithRouter(<Photos />);
    const galleryImagesElement = await screen.findAllByTestId('gallery-images');
    expect(galleryImagesElement[0].childElementCount).toEqual(0);
  });
});
