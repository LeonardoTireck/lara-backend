import { RouteHandlerMethod } from 'fastify';
import { FastifyRoute } from '../../../application/ports/FastifyRoute';
import { UserControllers } from './controllers/UserControllers';
import { createUserSchema, loginSchema } from './schemas/UserSchemas';
import { ServerControllers } from './controllers/ServerController';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/Types';

@injectable()
export class Router {
  constructor(
    @inject(TYPES.UserControllers)
    private readonly userControllers: UserControllers,
    @inject(TYPES.ServerControllers)
    private readonly serverControllers: ServerControllers,
  ) {}

  createRoutes = (): FastifyRoute[] => {
    return [
      {
        method: 'get',
        path: '/users',
        handler: this.userControllers.getAll as RouteHandlerMethod,
      },
      {
        method: 'post',
        path: '/newUser',
        schema: {
          body: createUserSchema,
        },
        handler: this.userControllers.newUser as RouteHandlerMethod,
      },
      {
        method: 'get',
        path: '/health',
        handler: this.serverControllers.healthCheck as RouteHandlerMethod,
      },
      {
        method: 'post',
        path: '/login',
        schema: {
          body: loginSchema,
        },
        handler: this.userControllers.login as RouteHandlerMethod,
      },
      {
        method: 'post',
        path: '/refresh',
        handler: this.userControllers.refreshToken as RouteHandlerMethod,
      },
    ];
  };
}
