import { RouteHandlerMethod } from 'fastify';
import { FastifyRoute } from './interface/fastifyRoute';
import { UserControllers } from './controllers/userControllers';
import { createUserSchema, loginSchema } from './schemas/userSchemas';
import { ServerControllers } from './controllers/serverController';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { AuthMiddleware } from './middlewares/authMiddleware';

@injectable()
export class Router {
  constructor(
    @inject(TYPES.UserControllers)
    private readonly userControllers: UserControllers,
    @inject(TYPES.ServerControllers)
    private readonly serverControllers: ServerControllers,
    @inject(TYPES.AuthMiddleware)
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  createRoutes = (): FastifyRoute[] => {
    return [
      {
        method: 'get',
        path: '/users',
        preHandlers: [this.authMiddleware.verify(['admin'])],
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
        path: '/logout',
        handler: this.userControllers.logout as RouteHandlerMethod,
      },
      {
        method: 'post',
        path: '/refresh',
        handler: this.userControllers.refreshToken as RouteHandlerMethod,
      },
    ];
  };
}
