import useLocalStorage, { UseLocalStorageReturnType } from '~/hooks/useLocalStorage';
import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest';
import { renderHook } from '~/test.utils';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should return empty string', () => {
    const { result } = renderHook(() => useLocalStorage('key'));
    expectTypeOf(result.current).toBeArray();
    expect(result.current.length).toEqual(3);
    expect(result.current[0]).toEqual(null);
  });

  it('should return value', () => {
    window.localStorage.setItem('key', 'storage value');
    const { result } = renderHook(() => useLocalStorage('key'));
    console.log(result.current[0]);

    expect(result.current[0]).toEqual('storage value');
  });

  it('should set value and get value', () => {
    const { result: first } = renderHook(() => useLocalStorage('key'));

    const [, setState] = first.current;
    setState('Another storage value');
    const { result: second } = renderHook(() => useLocalStorage('key'));
    expect(second.current[0]).toBe('Another storage value');
  });

  describe('delete', () => {
    let storageValue: UseLocalStorageReturnType;
    beforeEach(() => {
      const { result: first } = renderHook(() => useLocalStorage('key'));
      const [, setState] = first.current;
      setState('Delete value');
      const { result: second } = renderHook(() => useLocalStorage('key'));
      storageValue = second.current;
    });

    it('should delete value', () => {
      expect(storageValue[0]).toEqual('Delete value');

      const { result: third } = renderHook(() => useLocalStorage('key'));
      const [, , deleteValue] = third.current;
      deleteValue();

      const { result: fourth } = renderHook(() => useLocalStorage('key'));
      expect(fourth.current[0]).toEqual(null);
    });
  });
});
