import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Router } from '../infrastructure/http/fastify/routes';
import { Container } from 'inversify';
import PasswordHasher from '../application/ports/passwordHasher';
import { RefreshTokenRepository } from '../application/ports/refreshTokenRepository';
import { UserRepository } from '../application/ports/userRepository';
import { CreateUser } from '../application/usecases/createUser.usecase';
import { GetAllUsers } from '../application/usecases/getAllUsers.usecase';
import { Login } from '../application/usecases/login.usecase';
import { Logout } from '../application/usecases/logout.usecase';
import { RefreshToken } from '../application/usecases/refreshToken.usecase';
import { JwtService } from '../infrastructure/auth/jwtService';
import { ConfigService } from '../infrastructure/config/configService';
import { createDynamoDBClient } from '../infrastructure/dynamodb/dynamoDBClient';
import { DynamoDbRefreshTokensRepo } from '../infrastructure/dynamodb/repos/refreshTokensRepo';
import { DynamoDbUserRepo } from '../infrastructure/dynamodb/repos/userRepo';
import BcryptPasswordHasher from '../infrastructure/hashing/bcryptPasswordHasher';
import { TYPES } from './types';
import { ServerControllers } from '../infrastructure/http/fastify/controllers/serverController';
import { UserControllers } from '../infrastructure/http/fastify/controllers/userControllers';
import { AuthMiddleware } from '../infrastructure/http/fastify/middlewares/authMiddleware';

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
