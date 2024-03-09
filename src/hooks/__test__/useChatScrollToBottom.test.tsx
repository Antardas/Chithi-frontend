import useChatScrollToBottom from '~/hooks/useChatScrollToBottom';
import { RenderHookResult, render, renderHook, screen } from '~/test.utils';
import { RefObject, forwardRef } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

type Props = {
  dataList: number[];
};
const DemoContainer = forwardRef<HTMLDivElement, Props>((props, ref) => (
  <div ref={ref} data-testid="demo-container">
    {props.dataList.map((data, index) => (
      <div key={index}>{data}</div>
    ))}
  </div>
));

let dataList = Array(50)
  .fill(0)
  .map((_v, i) => i + 1);

describe('useChatScrollToBottom', () => {
  it('should be defined', () => {
    expect(useChatScrollToBottom).toBeDefined();
  });

  describe('props', () => {
    let hook: RenderHookResult<RefObject<HTMLDivElement>, never[]>;

    beforeEach(() => {
      hook = renderHook((value) => useChatScrollToBottom(value), {
        initialProps: []
      });
      hook.rerender(dataList as never[]);
    });

    it('should have an element ref', () => {
      const { current } = hook.result.current;
      expect(current).toBeDefined();
    });
  });

  describe('scroll', () => {
    let hook: RenderHookResult<RefObject<HTMLDivElement>, never[]>;
    const scrollerNode = document.createElement('div');

    beforeEach(() => {
      hook = renderHook(() => useChatScrollToBottom(dataList));
      render(<DemoContainer dataList={dataList} ref={hook.result.current} />);
      hook.result.current = scrollerNode as unknown as RefObject<HTMLDivElement>;
      hook.rerender(dataList as never[]);
    });

    it('should have zero scrollTop value', async () => {
      const demoContainer = screen.queryByTestId('demo-container') as HTMLElement;
      const end = 200;
      const start = 50;
      const dataList2 = Array.from({ length: end - start }, (_, i) => start + 1 + i);
      dataList = [...dataList, ...dataList2];
      hook.rerender(dataList as never[]);
      expect(demoContainer.scrollTop).toEqual(0);
    });

    it('should have scrollTop value greater than zero', async () => {
      const demoContainer = screen.queryByTestId('demo-container') as HTMLElement;
      Object.defineProperty(demoContainer, 'scrollHeight', { configurable: true, value: 150 });
      Object.defineProperty(demoContainer, 'clientHeight', { configurable: true, value: 100 });
      const end = 500;
      const start = 200;
      const dataList2 = Array.from({ length: end - start }, (_, i) => start + 1 + i);
      dataList = [...dataList, ...dataList2];
      hook.rerender(dataList as never[]);
      expect(demoContainer.scrollTop).toBeGreaterThan(0);
    });
  });
});
