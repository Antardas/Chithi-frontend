import useDebounce from '~/hooks/useDebounce';
import { renderHook } from '~/test.utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.useFakeTimers();
vi.spyOn(global, 'setTimeout');
vi.spyOn(global, 'clearTimeout');

describe('useDebounce', () => {
  beforeEach(() => {
    vi.clearAllTimers()
    vi.clearAllMocks()
  })
  it('should be defined', () => {
    expect(useDebounce).toBeDefined();
  });

  it('should return debounce value', () => {
    const { result } = renderHook(() => useDebounce<string>('testing 1', 100));
    expect(result.current).toEqual('testing 1');
  });

  it('should debounce with default debounce value of 500 ms', () => {
    renderHook(() => useDebounce<string>('testing 1', 500));

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
  });

  it('should debounce with given debounce', () => {
    renderHook(() => useDebounce('testing', 2100));

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 2100);
  });

  it('should call clearTimeout on unmount', () => {
    const { unmount } = renderHook(() => useDebounce<string>('testing', 100));
    unmount();

    expect(clearTimeout).toHaveBeenCalledTimes(1);
  });
});
