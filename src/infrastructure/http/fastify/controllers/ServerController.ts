import { FastifyReply, FastifyRequest } from 'fastify';
import { injectable } from 'inversify';

@injectable()
export class ServerControllers {
    healthCheck = (_request: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send();
    };
}
