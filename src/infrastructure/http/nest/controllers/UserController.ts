import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
  Inject,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUser } from '../../../../application/usecases/CreateUser.usecase';
import { FindAllUsers } from '../../../../application/usecases/FindAllUsers.usecase';
import { TYPES } from '../../../../di/Types';
import { Login } from '../../../../application/usecases/Login.usecase';
import { RefreshToken } from '../../../../application/usecases/RefreshToken.usecase';
import { ConfigService } from '../../../config/ConfigService';
import { UnauthorizedError } from '../../../../application/errors/AppError';
import { Logout } from '../../../../application/usecases/Logout.usecase';
import { RoleAuthGuard } from '../guards/RoleAuth.guard';
import { Roles } from '../decorators/Roles.decorator';
import { User } from '../decorators/User.decorator';
import { createUserSchema, loginSchema } from '../schemas/UserSchemas';

@Controller('v1')
export class UserController {
  constructor(
    @Inject(TYPES.ConfigService)
    private configService: ConfigService,
    @Inject(TYPES.FindAllUsersUseCase)
    private findAllUsersUseCase: FindAllUsers,
    @Inject(TYPES.CreateUserUseCase)
    private createUserUseCase: CreateUser,
    @Inject(TYPES.LoginUseCase)
    private loginUseCase: Login,
    @Inject(TYPES.RefreshTokenUseCase)
    private refreshTokenUseCase: RefreshToken,
    @Inject(TYPES.LogoutUseCase)
    private logoutUseCase: Logout,
  ) {}

  @Get('/users')
  @UseGuards(RoleAuthGuard)
  @Roles(['admin'])
  async getAll(
    @Query('limit') limit?: number,
    @Query('exclusiveStartKey') exclusiveStartKey?: string,
  ) {
    const paginatedOutput = await this.findAllUsersUseCase.execute({
      limit: Number(limit) || 10,
      exclusiveStartKey,
    });
    return { paginatedOutput };
  }

  @Post('/newUser')
  @HttpCode(HttpStatus.CREATED)
  async newUser(@Body() body: any) {
    const outputCreateUser = await this.createUserUseCase.execute(body);
    return outputCreateUser;
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const { email, password } = body;
    const { name, accessToken, refreshToken } = await this.loginUseCase.execute(
      {
        email,
        password,
      },
    );

    res.cookie('refreshToken', refreshToken, {
      path: '/v1/refresh',
      httpOnly: true,
      secure: this.configService.secureCookie,
      sameSite: 'strict',
    });

    return { name, accessToken };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token not found.');
    }

    await this.logoutUseCase.execute({ refreshToken });

    res.clearCookie('refreshToken', {
      path: '/v1/refresh',
      httpOnly: true,
      secure: this.configService.secureCookie,
      sameSite: 'strict',
    });

    return;
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = request.cookies.refreshToken;
    if (!oldRefreshToken)
      throw new UnauthorizedError('Refresh token not found.');

    const output = await this.refreshTokenUseCase.execute({
      refreshToken: oldRefreshToken,
    });

    const { accessToken, refreshToken } = output;

    res.cookie('refreshToken', refreshToken, {
      path: '/v1/refresh',
      httpOnly: true,
      secure: this.configService.secureCookie,
      sameSite: 'strict',
    });

    return { accessToken };
  }
}
