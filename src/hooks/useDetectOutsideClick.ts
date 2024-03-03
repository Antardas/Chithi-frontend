import React, { useEffect, useState } from 'react';
type SetState = (state: boolean) => void;
const useDetectOutsideClick = <T extends HTMLElement>(ref: React.RefObject<T>, initialState: boolean = false): [boolean, SetState] => {
  const [isActive, setIsActive] = useState<boolean>(initialState);
  const onClick = (event: MouseEvent) => {
    if (ref !== null) {
      if (ref.current !== null && !ref.current.contains(event.target as Node)) {
        setIsActive(!setIsActive);
      }
    }
  };
  useEffect(() => {
    if (isActive) {
      window.addEventListener('mousedown', onClick);
    }

    return () => {
      window.removeEventListener('mousedown', onClick);
    };
  }, [isActive, ref]);

  return [isActive, setIsActive];
};

export default useDetectOutsideClick;
