import '@fastify/cookie';
import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'inversify';
import { CreateUser } from '../../../../application/usecases/createUser.usecase';
import { GetAllUsers } from '../../../../application/usecases/getAllUsers.usecase';
import { TYPES } from '../../../../di/types';
import { GetAllUsersRequest, LoginRequest } from './requestTypes';
import { Login } from '../../../../application/usecases/login.usecase';
import { RefreshToken } from '../../../../application/usecases/refreshToken.usecase';
import { ConfigService } from '../../../config/configService';
import { UnauthorizedError } from '../../../../application/errors/appError';
import { Logout } from '../../../../application/usecases/logout.usecase';

@injectable()
export class UserControllers {
  constructor(
    @inject(TYPES.ConfigService)
    private configService: ConfigService,
    @inject(TYPES.FindAllUsersUseCase)
    private findAllUsersUseCase: GetAllUsers,
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
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token not found.');
    }
    await this.logoutUseCase.execute({ refreshToken });
    return reply
      .clearCookie('refreshToken', {
        path: '/v1/refresh',
        httpOnly: true,
        secure: this.configService.secureCookie,
        sameSite: 'strict',
      })
      .status(204)
      .send();
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
