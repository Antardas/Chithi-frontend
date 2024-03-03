type SetValue = (value: string) => void;
type RemoveValue = () => void;

type UseLocalStorageReturnType = string | [SetValue] | [RemoveValue] | undefined;

const useLocalStorage = (key: string, type: 'GET' | 'SET' | 'REMOVE'): UseLocalStorageReturnType => {
  try {
    if (type === 'GET') {
      const item = window.localStorage.getItem(key);
      return item ?? '';
    } else if (type === 'SET') {
      const setValue: SetValue = (value: string) => window.localStorage.setItem(key, value);
      return [setValue];
    } else if (type === 'REMOVE') {
      const removeValue: RemoveValue = () => window.localStorage.removeItem(key);
      return [removeValue];
    }
  } catch (error) {
    console.log(error);
  }
};

export default useLocalStorage;
