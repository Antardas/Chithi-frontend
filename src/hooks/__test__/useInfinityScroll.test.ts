
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {renderHook } from '~/test.utils'
import useInfinityScroll from '~/hooks/useInfinityScroll';
const bodyRef = { current: document.createElement('div') };
const bottomLineRef = { current: document.createElement('div') };
const mockCallback = vi.fn();

const bodyAddEventListenerSpy = vi.spyOn(bodyRef.current, 'addEventListener');
const bodyRemoveEventListenerSpy = vi.spyOn(bodyRef.current, 'removeEventListener');

describe('useInfiniteScroll', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should call addEventListener', () => {
    renderHook(() => useInfinityScroll(bodyRef, bottomLineRef, mockCallback));
    expect(bodyAddEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(bodyRemoveEventListenerSpy).toHaveBeenCalledTimes(0);
  });

  it('should call removeEventListener', () => {
    const { unmount } = renderHook(() => useInfinityScroll(bodyRef, bottomLineRef, mockCallback));
    unmount();
    expect(bodyAddEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(bodyRemoveEventListenerSpy).toHaveBeenCalledTimes(1);
  });
});
