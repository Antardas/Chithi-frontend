type SetValue = (value: string) => void;
type RemoveValue = () => void;

type UseSessionReturnType = string | [SetValue] | [RemoveValue] | undefined;

const useSessionStorage = (key: string, type: 'GET' | 'SET' | 'REMOVE'): UseSessionReturnType => {
  try {
    if (type === 'GET') {
      const item = window.sessionStorage.getItem(key);
      return item ?? '';
    } else if (type === 'SET') {
      const setValue: SetValue = (value: string) => window.sessionStorage.setItem(key, value);
      return [setValue];
    } else if (type === 'REMOVE') {
      const removeValue: RemoveValue = () => window.sessionStorage.removeItem(key);
      return [removeValue];
    }
  } catch (error) {
    console.log(error);
  }
};

export default useSessionStorage;
