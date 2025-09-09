import {
    FastifySchema,
    HTTPMethods,
    preHandlerHookHandler,
    RouteHandlerMethod,
} from 'fastify';

export interface FastifyRoute {
    method: HTTPMethods;
    path: string;
    schema?: FastifySchema;
    preHandlers?: preHandlerHookHandler[];
    handler: RouteHandlerMethod;
}
