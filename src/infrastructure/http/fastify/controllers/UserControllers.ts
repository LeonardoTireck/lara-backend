import { FastifyReply } from 'fastify';
import { inject, injectable } from 'inversify';
import { CreateUser } from '../../../../application/usecases/CreateUser.usecase';
import { FindAllUsers } from '../../../../application/usecases/FindAllUsers.usecase';
import { TYPES } from '../../../../di/Types';
import { GetAllUsersRequest } from './RequestTypes';

@injectable()
export class UserControllers {
  constructor(
    @inject(TYPES.FindAllUsersUseCase)
    private findAllUsersUseCase: FindAllUsers,
    @inject(TYPES.CreateUserUseCase)
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

  newUser = async (request: any, reply: FastifyReply) => {
    const outputCreateUser = await this.createUserUseCase.execute(request.body);
    return reply.status(201).send(outputCreateUser);
  };
}
