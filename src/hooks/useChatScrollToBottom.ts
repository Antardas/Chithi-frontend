import { useEffect, useRef } from 'react';

const useChatScrollToBottom = (prop:Array<unknown>) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight - scrollRef.current?.clientHeight;
    }
  }, [prop]);

  return scrollRef;
};

export default useChatScrollToBottom;
