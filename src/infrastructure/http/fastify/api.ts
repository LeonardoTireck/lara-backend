import fastify, { FastifyInstance } from 'fastify';
import { FastifyRoute } from '../../../application/ports/FastifyRoute';

export class FastifyAdapter {
    private app: FastifyInstance;

    constructor(private routes: FastifyRoute[]) {
        this.app = fastify({ logger: true });
        this.registerRoutes();
    }

    private registerRoutes(): void {
        for (const route of this.routes) {
            this.app.route({
                method: route.method,
                url: route.path,
                schema: route.schema,
                preHandler: route.preHandlers,
                handler: route.handler,
            });
        }
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
