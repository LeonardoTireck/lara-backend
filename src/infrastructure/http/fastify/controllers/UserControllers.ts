import { FastifyReply } from 'fastify';
import { CreateUser } from '../../../../application/usecases/CreateUser.usecase';
import { FindAllUsers } from '../../../../application/usecases/FindAllUsers.usecase';
import { GetAllUsersRequest, NewUserRequest } from './RequestTypes';

export class UserControllers {
    constructor(
        private findAllUsersUseCase: FindAllUsers,
        private createUserUseCase: CreateUser,
    ) {}

    getAll = async (request: GetAllUsersRequest, reply: FastifyReply) => {
        const { limit, exclusiveStartKey } = request.query;
        const paginatedOutput = await this.findAllUsersUseCase.execute({
            limit: Number(limit) || 10,
            exclusiveStartKey,
        });

        return reply.status(200).send({ paginatedOutput });
    };

    newUser = async (request: NewUserRequest, reply: FastifyReply) => {
        const body = request.body;
        body.dateOfBirth = new Date(body.dateOfBirth);
        body.activePlan.startDate = new Date(body.activePlan.startDate);
        body.activePlan.expirationDate = new Date(
            body.activePlan.expirationDate,
        );
        const outputCreateUser = await this.createUserUseCase.execute(body);
        return reply.status(201).send(outputCreateUser);
    };
}
