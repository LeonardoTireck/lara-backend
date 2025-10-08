import fastify, { FastifyInstance } from 'fastify';
import { FastifyRoute } from '../../../application/ports/FastifyRoute';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { errorHandlerPlugin } from './middlewares/ErrorHandler';
import cookie from '@fastify/cookie';

export class FastifyAdapter {
  private app: FastifyInstance;

  constructor() {
    this.app = fastify({
      logger: true,
    });
    this.app.setValidatorCompiler(validatorCompiler);
    this.app.setSerializerCompiler(serializerCompiler);
    this.app.withTypeProvider<ZodTypeProvider>();
    this.app.register(cookie);
    this.app.register(errorHandlerPlugin);
  }

  public register(routes: FastifyRoute[], prefix: string): void {
    this.app.register(
      (instance, _opts, done) => {
        for (const route of routes) {
          instance.route({
            method: route.method,
            url: route.path,
            schema: route.schema,
            preHandler: route.preHandlers,
            handler: route.handler,
          });
        }
        done();
      },
      { prefix },
    );
  }

  async listen(port: number): Promise<void> {
    try {
      await this.app.listen({ port, host: '0.0.0.0' });
    } catch (err) {
      this.app.log.error(err);
      process.exit(1);
    }
  }
}
