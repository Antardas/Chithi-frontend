import { RenderOptions, render } from '@testing-library/react';
import React, { PropsWithChildren, isValidElement } from 'react';
import { Provider } from 'react-redux';
import { RouteObject, RouterProvider, createMemoryRouter } from 'react-router-dom';
import { store } from '~/redux/store'

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

/**
 * @see [Testing React Router v6 (no mocking)](https://webup.org/blog/how-to-avoid-mocking-in-react-router-v6-tests/) for more details and alternative approaches.
 *
 * Renders a React component within a simulated React Router v6 context.
 *
 * @param children - The React component to render.
 * @param routes (optional) - An array of route objects to configure the router.
 * @returns The rendered component.
 */
const renderWithRouter = (children: React.ReactElement<unknown>, routes: RouteObject[] = []) => {
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
