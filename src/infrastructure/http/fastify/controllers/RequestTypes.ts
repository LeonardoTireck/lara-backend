import { FastifyRequest } from 'fastify';

export type GetAllUsersRequest = FastifyRequest<{
  Querystring: { limit?: number; exclusiveStartKey?: Record<string, any> };
}>;
