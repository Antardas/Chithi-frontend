import { renderWithRouter, screen, waitFor } from '~/test.utils';
import { describe, expect, it } from 'vitest';
import { postMockData } from '~/mocks/data/post.mock';
import userEvent from '@testing-library/user-event';
import DisplayReactionAndComment from '~/Components/Post/Reactions/DisplayReactionAndComment';

describe('ReactionsAndCommentsDisplay', () => {
  it('should display reactions count', () => {
    renderWithRouter(<DisplayReactionAndComment post={postMockData} />);
    const reactionsCount = screen.queryByTestId('reactions-count') as HTMLElement;
    expect(parseInt(reactionsCount.childNodes.item(0).textContent as string, 10)).toEqual(3);
  });

  it('should display reactions count tooltip', async () => {
    const user = userEvent.setup();
    renderWithRouter(<DisplayReactionAndComment post={postMockData} />);
    const reactionsCount = screen.queryByTestId('reactions-count') as HTMLElement;
    await user.hover(reactionsCount);
    // await act(() => {});
    await waitFor(() => {
      const reactionsCountTooltip = screen.queryByTestId('tooltip-container');
      expect(reactionsCountTooltip).toBeInTheDocument();
    });
  });

  it('should display reaction tooltip', async () => {
    const user = userEvent.setup();
    renderWithRouter(<DisplayReactionAndComment post={postMockData} />);
    const reaction = screen.queryAllByTestId('reaction-img');

    await user.hover(reaction[1]);
    await waitFor(() => {
      const reactionsTooltip = screen.queryAllByTestId('reaction-tooltip');
      expect(reactionsTooltip[0]).toBeInTheDocument();
    });
  });

  it('should display comments count', () => {
    renderWithRouter(<DisplayReactionAndComment post={postMockData} />);
    const commentsCount = screen.queryByTestId('comment-count') as HTMLElement;
    expect(commentsCount.textContent).toEqual('3 Comments');
  });

  it('should display comments count tooltip', async () => {
    const user = userEvent.setup();
    renderWithRouter(<DisplayReactionAndComment post={postMockData} />);
    const commentsCount = screen.queryByTestId('comment-count') as HTMLElement;

    await user.hover(commentsCount);
    const commentsTooltip = await screen.findByTestId('comment-tooltip');
    expect(commentsTooltip).toBeInTheDocument();
  });
});
