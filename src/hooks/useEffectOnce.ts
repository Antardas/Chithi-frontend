import { useEffect, useRef } from 'react';

const useEffectOnce = (callback: () => void) => {
  const ref = useRef<boolean>(false);
  useEffect(() => {
    if (!ref.current) {
      callback();
      ref.current = true;
    }
  }, [callback]);
};

export default useEffectOnce;
