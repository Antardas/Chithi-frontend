import { setupServer } from 'msw/node';
import { authHandler } from '~/mocks/handlers/auth';
import {notificationHandlers} from '~/mocks/handlers/notification';

// Setup request interception using the given handlers
export const server = setupServer(...authHandler, ...notificationHandlers);
