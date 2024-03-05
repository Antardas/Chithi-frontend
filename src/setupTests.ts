import { afterEach, beforeAll, afterAll, expect } from 'vitest';
import '@testing-library/jest-dom';
import 'vitest-canvas-mock';
import '@testing-library/jest-dom/vitest';
import { server } from '~/mocks/server';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'bypass'
  });
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  server.close();
});
