import {
    FastifySchema,
    preHandlerHookHandler,
    RouteHandlerMethod,
} from 'fastify';

export interface FastifyRoute {
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    path: string;
    handler: RouteHandlerMethod;
    schema?: FastifySchema;
    preHandlers?: preHandlerHookHandler[];
}
