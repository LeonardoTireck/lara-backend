import {
  FastifyError,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';
import { ZodError } from 'zod';
import {
  AppError,
  ValidationError,
} from '../../../../application/errors/AppError';

export const errorHandlerPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.setErrorHandler(
    (error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
      if (error instanceof AppError) {
        reply.status(error.statusCode).send({
          error: {
            message: error.message,
            details: error.details,
          },
        });
        return;
      }

      if (error instanceof ZodError) {
        const details = error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        const validationError = new ValidationError(details);

        reply.status(validationError.statusCode).send({
          error: {
            message: validationError.message,
            details: validationError.details,
          },
        });
        return;
      }

      fastify.log.error(error);
      reply.status(500).send({
        error: { message: 'Internal Server Error' },
      });
    },
  );
});
