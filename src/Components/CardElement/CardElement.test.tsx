import { describe, expect, it } from 'vitest';
import { render, screen } from '~/test.utils';
import CardElement from '.';

describe('CardElementStats', () => {
  it('should display zeros', () => {
    const props = {
      postCount: 0,
      followersCount: 0,
      followingCount: 0
    };
    render(<CardElement {...props} />);
    const h5Elements = screen.queryAllByTestId('info');
    expect(h5Elements[0].textContent).toEqual('0');
    expect(h5Elements[1].textContent).toEqual('0');
    expect(h5Elements[2].textContent).toEqual('0');
  });

  it('should display shortened non-zero values', () => {
    const props = {
      postCount: 23464657,
      followersCount: 537377372,
      followingCount: 36362636
    };
    render(<CardElement {...props} />);
    const h5Elements = screen.queryAllByTestId('info');
    expect(h5Elements[0].textContent).toEqual('23.5M');
    expect(h5Elements[1].textContent).toEqual('537.4M');
    expect(h5Elements[2].textContent).toEqual('36.4M');
  });
});
