export type SetValue = (value: string) => void;
export type RemoveValue = () => void;

type UseLocalStorageReturnType = [string | null, SetValue, RemoveValue];
/**
 * Custom hook for interacting with localStorage.
 * @param {string} key - The key to access the value in localStorage.
 * @returns {UseLocalStorageReturnType} An array containing the item, setValue function, and removeValue function.
 */
const useLocalStorage = (key: string): UseLocalStorageReturnType => {

  const item = window.localStorage.getItem(key);

  const setValue: SetValue = (value: string) => window.localStorage.setItem(key, value);

  const removeValue: RemoveValue = () => window.localStorage.removeItem(key);

  return [item, setValue, removeValue];
};

export default useLocalStorage;
