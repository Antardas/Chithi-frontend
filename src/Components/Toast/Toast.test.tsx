import { beforeEach, describe, expect, it, vi } from 'vitest';
import checkIcon from '~/assets/images/check.svg';
import errorIcon from '~/assets/images/error.svg';
import Toast, { IToastProps } from '~/Components/Toast';
import { renderWithRouter, screen, waitFor } from '~/test.utils';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

const props: IToastProps = {
  position: 'top-left',
  toastList: [
    { id: 1, backgroundColor: '#5cb85c', icon: checkIcon, description: 'This is a message', type: 'success' },
    { id: 2, backgroundColor: '#d9534f', icon: errorIcon, description: 'This is an error', type: 'info' }
  ],
  autoDelete: false,
  autoDeleteTime: 100
};
describe('Toast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should display a toast', async () => {
    const { baseElement } = renderWithRouter(<Toast {...props} />);
    const toastContainer = baseElement.querySelector('.toast-notification-container');
    const toastContainerElements = screen.getAllByTestId('toast-notification');

    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveClass(props.position);
    expect(toastContainerElements.length).toEqual(2);
  });

  it('should have toast elements', async () => {
    const removedElement = props.toastList.splice(1, 1);
    renderWithRouter(<Toast {...props} />);
    props.toastList.push(...removedElement);
    const toastContainerElements = screen.getAllByTestId('toast-notification');
    const imgElement = screen.getByRole('img');
    const description = screen.getByText(/this is a message/i);
    const styles = window.getComputedStyle(toastContainerElements[0]);

    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', '/src/assets/images/check.svg');
    expect(styles.backgroundColor).toEqual('rgb(92, 184, 92)');
    expect(description).toBeInTheDocument();
  });

  it('should remove toast by calling deleteToast', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Toast {...props} />);
    const buttonElements = screen.getAllByRole('button');
    await user.click(buttonElements[0]);
    await waitFor(() => expect(screen.queryAllByTestId('toast-notification').length).toEqual(1));
  });

  it('should auto remove toast', async () => {
    const user = userEvent.setup();
    vi.useFakeTimers();

    const { rerender } = renderWithRouter(<Toast {...props} />);
    expect(screen.queryAllByTestId('toast-notification').length).toEqual(2);
    props.autoDelete = true;
    props.autoDeleteTime = 100;
    act(() => {
      vi.runOnlyPendingTimers();
    });
    rerender(<Toast {...props} />);
    await waitFor(() => expect(screen.queryAllByTestId('toast-notification').length).toEqual(0));
  });
});
