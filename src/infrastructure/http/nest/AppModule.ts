import { Module } from '@nestjs/common';
import { UserController } from './controllers/UserController';
import { ServerController } from './controllers/ServerController';
import { AuthGuard } from './guards/Auth.guard';
import { AuthMiddleware } from './middlewares/AuthMiddleware';
import { container } from '../../../di/Inversify.config';
import { TYPES } from '../../../di/Types';
import { CreateUser } from '../../../application/usecases/CreateUser.usecase';
import { FindAllUsers } from '../../../application/usecases/GetAllUsers.usecase';
import { Login } from '../../../application/usecases/Login.usecase';
import { RefreshToken } from '../../../application/usecases/RefreshToken.usecase';
import { Logout } from '../../../application/usecases/Logout.usecase';
import { ConfigService } from '../../config/ConfigService';

@Module({
  imports: [],
  controllers: [UserController, ServerController],
  providers: [
    AuthGuard,
    AuthMiddleware,
    {
      provide: TYPES.CreateUserUseCase,
      useValue: container.get<CreateUser>(TYPES.CreateUserUseCase),
    },
    {
      provide: TYPES.FindAllUsersUseCase,
      useValue: container.get<FindAllUsers>(TYPES.FindAllUsersUseCase),
    },
    {
      provide: TYPES.LoginUseCase,
      useValue: container.get<Login>(TYPES.LoginUseCase),
    },
    {
      provide: TYPES.RefreshTokenUseCase,
      useValue: container.get<RefreshToken>(TYPES.RefreshTokenUseCase),
    },
    {
      provide: TYPES.LogoutUseCase,
      useValue: container.get<Logout>(TYPES.LogoutUseCase),
    },
    {
      provide: TYPES.ConfigService,
      useValue: container.get<ConfigService>(TYPES.ConfigService),
    },
  ],
})
export class AppModule {}
