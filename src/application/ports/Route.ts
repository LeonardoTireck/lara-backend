import { Controller, Middleware } from './httpServer';

export interface Route {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  controller: Controller;
  middlewares?: Middleware[];
}
