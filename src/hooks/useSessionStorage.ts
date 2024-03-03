type SetValue = (value: string) => void;
type RemoveValue = () => void;

type UseSessionStorageReturnType = [string | null, SetValue, RemoveValue];
/**
 * Custom hook for interacting with sessionStorage.
 * @param {string} key - The key to access the value in sessionStorage.
 * @returns {UseSessionStorageReturnType} An array containing the item, setValue function, and removeValue function.
 */
const useSessionStorage = (key: string): UseSessionStorageReturnType => {

  const item = window.sessionStorage.getItem(key);

  const setValue: SetValue = (value: string) => window.sessionStorage.setItem(key, value);

  const removeValue: RemoveValue = () => window.sessionStorage.removeItem(key);

  return [item, setValue, removeValue];
};

export default useSessionStorage;
