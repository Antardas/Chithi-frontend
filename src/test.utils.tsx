import { RenderOptions, render } from '@testing-library/react';
import React, { PropsWithChildren, isValidElement } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { store } from '~/redux/store';
// import router from '~/routes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Providers = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <Provider store={store}>
      {children}
      {/* <RouterProvider router={router}></RouterProvider> */}
    </Provider>
  );
};
const customRender = (ui: React.ReactNode, options?: RenderOptions) => render(ui, { wrapper: Providers, ...options });

// NOTE: https://webup.org/blog/how-to-avoid-mocking-in-react-router-v6-tests/
const renderWithRouter = (children: React.ReactElement<unknown>, routes = []) => {
  const options = isValidElement(children) ? { element: children, path: '/' } : children;

  const router = createMemoryRouter([{ ...options }, ...routes], {
    initialEntries: [options.path],
    initialIndex: 1
  });

  return render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export * from '@testing-library/react';
export { customRender as render, renderWithRouter };
