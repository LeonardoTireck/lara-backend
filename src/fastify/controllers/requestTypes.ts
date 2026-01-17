import { FastifyRequest } from 'fastify';

export type GetAllUsersRequest = FastifyRequest<{
  Querystring: { limit?: number; exclusiveStartKey?: string };
}>;

export type LoginRequest = FastifyRequest<{
  Body: { email: string; password: string };
}>;
