import fastify, {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
} from 'fastify';
import {
    Controller,
    HttpRequest,
    HttpResponse,
    HttpServer,
    Middleware,
} from '../../../application/ports/HttpServer';
import { UserControllers } from '../controllers/UserControllers';

export class FastifyAdapter implements HttpServer {
    private app: FastifyInstance;

    constructor(private userControllers: UserControllers) {
        this.app = fastify({ logger: true });
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.on('get', '/users', this.userControllers.getAll, []);
        this.on('post', '/newUser', this.userControllers.newUser, []);
    }

    on(
        method: 'get' | 'patch' | 'post' | 'put' | 'delete',
        path: string,
        controller: Controller,
        middlewares: Middleware[],
    ): void {
        const handler = async (req: FastifyRequest, reply: FastifyReply) => {
            const httpRequest: HttpRequest = {
                body: req.body,
                params: req.params,
                headers: req.headers,
                query: req.query,
            };
            const httpResponse: HttpResponse = await controller(httpRequest);
            reply.status(httpResponse.statusCode).send(httpResponse.body);
        };

        const preHandlers = middlewares.map((middleware) => {
            return async (req: FastifyRequest, reply: FastifyReply) => {
                const httpRequest: HttpRequest = {
                    body: req.body,
                    params: req.params,
                    headers: req.headers,
                    query: req.query,
                };
                const response = await middleware(httpRequest);
                if (response) {
                    reply.status(response.statusCode).send(response.body);
                }
            };
        });
        this.app[method](path, { preHandler: preHandlers, handler });
    }

    async listen(port: number): Promise<void> {
        try {
            await this.app.listen({ port, host: '127.0.0.1' });
        } catch (err) {
            this.app.log.error(err);
            process.exit(1);
        }
    }
}
