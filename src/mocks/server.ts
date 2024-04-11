import { setupServer } from 'msw/node';
import { authHandler } from '~/mocks/handlers/auth';
import {notificationHandlers} from '~/mocks/handlers/notification';
import { giphyHandlers } from '~/mocks/handlers/giphy';

// Setup request interception using the given handlers
export const server = setupServer(...authHandler, ...notificationHandlers, ...giphyHandlers);
