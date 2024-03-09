import useDetectOutsideClick from '~/hooks/useDetectOutsideClick';
import { renderHook } from '~/test.utils';
import { act } from 'react-dom/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');
const windowRemoveEventListenerSpy = vi.spyOn(window, 'removeEventListener');

const ref = { current: document.createElement('div') };

describe('useDetectOutsideClick', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useDetectOutsideClick(ref, false));
    const [isActive] = result.current;
    expect(isActive).toBeFalsy();
  });

  it('should update initial value', () => {
    const { result } = renderHook(() => useDetectOutsideClick(ref, false));
    const [isActive, setActive] = result.current;
    expect(isActive).toBeFalsy();
    act(() => {
      setActive(true);
    });
    const [active] = result.current;
    expect(active).toBeTruthy();
  });

  it('should set value to false if true', async () => {
    const { result } = renderHook(() => useDetectOutsideClick(ref, true));
    const [, setActive] = result.current;
    act(() => {
      setActive(false);
    });
    const [isActive] = result.current;
    expect(isActive).toBeFalsy();
    expect(windowAddEventListenerSpy).toHaveBeenCalledTimes(1);
  });

  it('should remove listener when unmounted', async () => {
    const { unmount } = renderHook(() => useDetectOutsideClick(ref, false));
    unmount();
    expect(windowAddEventListenerSpy).toHaveBeenCalledTimes(0);
    expect(windowRemoveEventListenerSpy).toHaveBeenCalledTimes(1);
  });
});
