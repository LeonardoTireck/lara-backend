import { FastifyRequest } from 'fastify';

export type GetAllUsersRequest = FastifyRequest<{
  Querystring: { limit?: number; exclusiveStartKey?: Record<string, any> };
}>;

export type LoginRequest = FastifyRequest<{
  Body: { email: string; password: string };
}>;
