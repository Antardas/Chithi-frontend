import Avatar, { AvatarProps } from '~/Components/Avatar';
import { render, screen } from '~/test.utils';
import { describe, beforeEach, it, expect, vi } from 'vitest';
describe('Avatar', () => {
  describe('with no image src', () => {
    let props: AvatarProps;
    beforeEach(() => {
      props = {
        avatarSrc: '',
        name: 'Martin',
        bgColor: 'green',
        textColor: 'white',
        size: 40
      };

      vi.clearAllMocks();
    });

    it('should render div with background color', () => {
      render(<Avatar {...props} />);
      const divElement = screen.getByTestId('avatar-container');
      const divElementStyles = window.getComputedStyle(divElement);
      screen.debug();
      expect(divElementStyles.backgroundColor).toBe('rgb(0, 128, 0)');
      expect(divElementStyles.width).toBe('40px');
      expect(divElementStyles.height).toBe('40px');
    });

    it('should have first letter of name', () => {
      render(<Avatar {...props} />);
      const avatarNameElement = screen.getByTestId('avatar-name');
      const avatarNameElementStyles = window.getComputedStyle(avatarNameElement);
      expect(avatarNameElement.textContent).toBe('M');
      expect(avatarNameElementStyles.textTransform).toBe('uppercase');
    });
  });

  describe('with image src', () => {
    let props: AvatarProps;
    beforeEach(async () => {
      props = {
        avatarSrc: 'https://place-hold.it',
        name: 'Martin',
        bgColor: 'green',
        textColor: 'white',
        size: 40
      };
    });

    it('should render img', () => {
      render(<Avatar {...props} />);
      const imgElement = screen.getByRole('img');
      expect(imgElement).toBeInTheDocument();
    });

    it('should have image src', () => {
      render(<Avatar {...props} />);
      const imgElement = screen.getByRole('img');
      expect(imgElement).toHaveAttribute('src', 'https://place-hold.it');
    });
  });
});
