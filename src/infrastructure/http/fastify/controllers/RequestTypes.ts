import { FastifyRequest } from 'fastify';
import { TrainingPlan } from '../../../../domain/TrainingPlan';

export type GetAllUsersRequest = FastifyRequest<{
    Querystring: { limit?: number; exclusiveStartKey?: Record<string, any> };
}>;

export type NewUserRequest = FastifyRequest<{
    Body: {
        name: string;
        email: string;
        documentCPF: string;
        phone: string;
        dateOfBirth: Date;
        password: string;
        activePlan: TrainingPlan;
    };
}>;
