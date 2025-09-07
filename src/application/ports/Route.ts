import { Controller, Middleware } from './HttpServer';

export interface Route {
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    path: string;
    controller: Controller;
    middlewares?: Middleware[];
}
