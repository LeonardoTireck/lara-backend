import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Container } from 'inversify';
import { RefreshTokenRepository } from '../auth/application/interface/refreshTokenRepository';
import { Login } from '../auth/application/usecase/login.usecase';
import { Logout } from '../auth/application/usecase/logout.usecase';
import { RefreshToken } from '../auth/application/usecase/refreshToken.usecase';
import { JwtService } from '../auth/infrastructure/jwtService';
import { ConfigService } from '../config/configService';
import { createDynamoDBClient } from '../dynamodb/dynamoDBClient';
import { DynamoDbRefreshTokensRepo } from '../dynamodb/repos/refreshTokensRepo';
import { DynamoDbUserRepo } from '../dynamodb/repos/userRepo';
import BcryptPasswordHasher from '../hashing/bcryptPasswordHasher';
import PasswordHasher from '../hashing/interface/passwordHasher';
import { ServerControllers } from '../fastify/controllers/serverController';
import { UserControllers } from '../fastify/controllers/userControllers';
import { AuthMiddleware } from '../fastify/middlewares/authMiddleware';
import { Router } from '../fastify/routes';
import { UserRepository } from '../user/application/interface/userRepository';
import { GetAllUsers } from '../user/application/usecase/getAllUsers.usecase';
import { TYPES } from './types';
import { CreateUser } from '../user/application/usecase/createUser.usecase';

const container = new Container();

//Configurations
container
  .bind<ConfigService>(TYPES.ConfigService)
  .to(ConfigService)
  .inSingletonScope();

const configService = container.get<ConfigService>(TYPES.ConfigService);
const dynamoDbClient = createDynamoDBClient(configService);
container
  .bind<DynamoDBClient>(TYPES.DynamoDBClient)
  .toConstantValue(dynamoDbClient);

//Repos
container
  .bind<UserRepository>(TYPES.UserRepository)
  .to(DynamoDbUserRepo)
  .inSingletonScope();
container
  .bind<RefreshTokenRepository>(TYPES.RefreshTokenRepository)
  .to(DynamoDbRefreshTokensRepo)
  .inSingletonScope();

//Utils
container
  .bind<PasswordHasher>(TYPES.PasswordHasher)
  .toConstantValue(new BcryptPasswordHasher(configService.saltrounds));
container.bind<JwtService>(TYPES.JwtService).to(JwtService).inSingletonScope();

//UseCases
container.bind<Login>(TYPES.LoginUseCase).to(Login).inSingletonScope();
container.bind<Logout>(TYPES.LogoutUseCase).to(Logout).inSingletonScope();
container
  .bind<RefreshToken>(TYPES.RefreshTokenUseCase)
  .to(RefreshToken)
  .inSingletonScope();
container
  .bind<GetAllUsers>(TYPES.FindAllUsersUseCase)
  .to(GetAllUsers)
  .inSingletonScope();
container
  .bind<CreateUser>(TYPES.CreateUserUseCase)
  .to(CreateUser)
  .inSingletonScope();

//Controllers
container
  .bind<UserControllers>(TYPES.UserControllers)
  .to(UserControllers)
  .inSingletonScope();
container
  .bind<ServerControllers>(TYPES.ServerControllers)
  .to(ServerControllers)
  .inSingletonScope();

//Router
container.bind<Router>(TYPES.Router).to(Router).inSingletonScope();

//Middlewares
container
  .bind<AuthMiddleware>(TYPES.AuthMiddleware)
  .to(AuthMiddleware)
  .inSingletonScope();

export { container };
