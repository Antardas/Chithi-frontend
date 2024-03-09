import useEffectOnce from '~/hooks/useEffectOnce';
import { renderHook } from '~/test.utils';
import { describe, expect, it, vi } from 'vitest';

describe('useEffectOnce', () => {
  it('should run provided effect only once', () => {
    const mockEffectCallback = vi.fn();
    const { rerender } = renderHook(() => useEffectOnce(mockEffectCallback));
    expect(mockEffectCallback).toHaveBeenCalledTimes(1);

    rerender();
    expect(mockEffectCallback).toHaveBeenCalledTimes(1);
  });
});
