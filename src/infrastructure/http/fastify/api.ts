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

export class FastifyAdapter implements HttpServer {
    private app: FastifyInstance;

    constructor() {
        this.app = fastify({ logger: true });
    }

    on(
        method: 'get' | 'post' | 'put' | 'delete',
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
            return async (req: FastifyRequest, _reply: FastifyReply) => {
                const httpRequest: HttpRequest = {
                    body: req.body,
                    params: req.params,
                    headers: req.headers,
                    query: req.query,
                };
                await middleware(httpRequest);
            };
        });
        this.app[method](path, { preHandler: preHandlers, handler });
    }

    async listen(port: number): Promise<void> {
        try {
            await this.app.listen({ port });
        } catch (err) {
            this.app.log.error(err);
            process.exit(1);
        }
    }
}
