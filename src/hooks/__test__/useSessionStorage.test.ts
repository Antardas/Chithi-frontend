import { UseLocalStorageReturnType } from '~/hooks/useLocalStorage';
import useSessionStorage from '~/hooks/useSessionStorage';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from '~/test.utils';

describe('useSessionStorage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should return empty string', () => {
    const { result } = renderHook(() => useSessionStorage('key'));
    expect(result.current[0]).toEqual(null);
  });

  it('should return value', () => {
    window.sessionStorage.setItem('key', 'storage value');
    const { result } = renderHook(() => useSessionStorage('key'));
    expect(result.current[0]).toEqual('storage value');
  });

  it('should set value and get value', () => {
    const { result: first } = renderHook(() => useSessionStorage('key'));
    const [, setState] = first.current;
    setState('Another storage value');
    const { result: second } = renderHook(() => useSessionStorage('key'));
    expect(second.current[0]).toEqual('Another storage value');
  });

  describe('delete', () => {
    let storageValue: UseLocalStorageReturnType;
    beforeEach(() => {
      const { result: first } = renderHook(() => useSessionStorage('key'));
      const [, setState] = first.current;
      setState('Delete value');
      const { result: second } = renderHook(() => useSessionStorage('key'));
      storageValue = second.current;
    });

    it('should delete value', () => {
      expect(storageValue[0]).toEqual('Delete value');

      const { result: third } = renderHook(() => useSessionStorage('key'));
      const [, , deleteValue] = third.current;
      deleteValue();

      const { result: fourth } = renderHook(() => useSessionStorage('key'));
      expect(fourth.current[0]).toEqual(null);
    });
  });
});
