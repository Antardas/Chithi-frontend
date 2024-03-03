import { useCallback, useEffect } from 'react';

const useInfinityScroll = (bodyRef: React.RefObject<HTMLDivElement>, bottomLineRef: React.RefObject<HTMLDivElement>, callback: () => void) => {
  // TODO: use Intersection Observer API
  const handleScroll = useCallback(() => {
    const containerHeight = bodyRef.current?.getBoundingClientRect().height ?? 0;
    const bottomLineTop = bottomLineRef.current?.getBoundingClientRect().top ?? 0;

    if (bottomLineTop <= containerHeight) {
      callback();
    }
  }, [bodyRef, bottomLineRef, callback]);
  useEffect(() => {
    const bodyRefCurrent = bodyRef.current;
    bodyRefCurrent?.addEventListener('scroll', handleScroll, true);

    return () => {
      bodyRefCurrent?.removeEventListener('scroll', handleScroll, true);
    };
  }, [bodyRef, handleScroll]);
};

export default useInfinityScroll;
