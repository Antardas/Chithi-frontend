import { setupServer } from 'msw/node';
import { authHandler } from '~/mocks/handlers/auth';
import { notificationHandlers } from '~/mocks/handlers/notification';
import { giphyHandlers } from '~/mocks/handlers/giphy';
import { postsHandlers } from '~/mocks/handlers/post';
import { reactionHandlers } from './handlers/reaction';
import { userHandlers } from './handlers/user';
import { followingHandlers } from './handlers/follow';
import { socketHandlers } from './handlers/sokcet';

// Setup request interception using the given handlers
export const server = setupServer(...authHandler, ...notificationHandlers, ...giphyHandlers, ...postsHandlers, ...reactionHandlers, ...userHandlers, ...followingHandlers, ...socketHandlers);
