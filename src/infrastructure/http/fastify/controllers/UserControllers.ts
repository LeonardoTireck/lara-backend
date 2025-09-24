import '@fastify/cookie';
import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'inversify';
import { CreateUser } from '../../../../application/usecases/CreateUser.usecase';
import { FindAllUsers } from '../../../../application/usecases/FindAllUsers.usecase';
import { TYPES } from '../../../../di/Types';
import { GetAllUsersRequest, LoginRequest } from './RequestTypes';
import { Login } from '../../../../application/usecases/Login.usecase';
import { RefreshToken } from '../../../../application/usecases/RefreshToken.usecase';
import { ConfigService } from '../../../config/ConfigService';
import { Logout } from '../../../../application/usecases/Logout.usecase';

@injectable()
export class UserControllers {
  constructor(
    @inject(TYPES.ConfigService)
    private configService: ConfigService,
    @inject(TYPES.FindAllUsersUseCase)
    private findAllUsersUseCase: FindAllUsers,
    @inject(TYPES.CreateUserUseCase)
    private createUserUseCase: CreateUser,
    @inject(TYPES.LoginUseCase)
    private loginUseCase: Login,
    @inject(TYPES.RefreshTokenUseCase)
    private refreshTokenUseCase: RefreshToken,
    @inject(TYPES.LogoutUseCase)
    private logoutUseCase: Logout,
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
    const { name, accessToken, refreshToken } = await this.loginUseCase.execute(
      {
        email,
        password,
      },
    );
    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/v1/refresh',
        httpOnly: true,
        secure: this.configService.secureCookie,
        sameSite: 'strict',
      })
      .status(200)
      .send({ name, accessToken });
  };

  logout = async (request: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) return reply.status(401).send('Unauthorized');
    await this.logoutUseCase.execute({ refreshToken: refreshToken });
    return reply.status(200).send();
  };

  refreshToken = async (request: any, reply: FastifyReply) => {
    const oldRefreshToken = request.cookies.refreshToken;
    if (!oldRefreshToken) return reply.status(401).send('Unauthorized');
    const output = await this.refreshTokenUseCase.execute({
      refreshToken: oldRefreshToken,
    });
    const { accessToken, refreshToken } = output;
    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/v1/refresh',
        httpOnly: true,
        secure: this.configService.secureCookie,
        sameSite: 'strict',
      })
      .status(200)
      .send({ accessToken });
  };
}
