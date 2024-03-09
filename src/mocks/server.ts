import { setupServer } from 'msw/node';
import { authHandler } from '~/mocks/handlers/auth';

// Setup request interception using the given handlers
export const server = setupServer(...authHandler);
