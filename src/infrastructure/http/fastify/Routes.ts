import { RouteHandlerMethod } from 'fastify';
import { FastifyRoute } from '../../../application/ports/FastifyRoute';
import { UserControllers } from './controllers/UserControllers';

export const createRoutes = (
    userControllers: UserControllers,
): FastifyRoute[] => {
    return [
        {
            method: 'get',
            path: '/users',
            handler: userControllers.getAll as RouteHandlerMethod,
        },
        {
            method: 'post',
            path: '/newUser',
            handler: userControllers.newUser as RouteHandlerMethod,
        },
    ];
};
