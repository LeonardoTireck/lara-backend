import { FastifyReply } from 'fastify';
import { inject, injectable } from 'inversify';
import { CreateUser } from '../../../../application/usecases/CreateUser.usecase';
import { FindAllUsers } from '../../../../application/usecases/FindAllUsers.usecase';
import { TYPES } from '../../../../di/Types';
import { GetAllUsersRequest, LoginRequest } from './RequestTypes';
import { Login } from '../../../../application/usecases/Login.usecase';

@injectable()
export class UserControllers {
  constructor(
    @inject(TYPES.FindAllUsersUseCase)
    private findAllUsersUseCase: FindAllUsers,
    @inject(TYPES.CreateUserUseCase)
    private createUserUseCase: CreateUser,
    @inject(TYPES.LoginUseCase)
    private loginUseCase: Login,
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

  login = async (request: LoginRequest, reply: FastifyReply) => {
    const { email, password } = request.body;
    const outputLogin = await this.loginUseCase.execute({ email, password });
    return reply.status(200).send(outputLogin);
  };
}
