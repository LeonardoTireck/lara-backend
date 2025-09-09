import { RouteHandlerMethod } from 'fastify';
import { FastifyRoute } from '../../../application/ports/FastifyRoute';
import { UserControllers } from './controllers/UserControllers';
import { createUserSchema } from './schemas/UserSchemas';

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
            schema: {
                body: createUserSchema,
            },
            handler: userControllers.newUser as RouteHandlerMethod,
        },
    ];
};
