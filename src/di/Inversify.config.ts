import { Container } from 'inversify';
import PasswordHasher from '../application/ports/PasswordHasher';
import { UserRepository } from '../application/ports/UserRepository';
import { CreateUser } from '../application/usecases/CreateUser.usecase';
import { GetAllUsers } from '../application/usecases/GetAllUsers.usecase';
import { ConfigService } from '../infrastructure/config/ConfigService';
import { DynamoDbUserRepo } from '../infrastructure/dynamodb/repos/UserRepo';
import { UserControllers } from '../infrastructure/http/fastify/controllers/UserControllers';
import { TYPES } from './Types';
import { createDynamoDBClient } from '../infrastructure/dynamodb/DynamoDBClient';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ServerControllers } from '../infrastructure/http/fastify/controllers/ServerController';
import { Router } from '../infrastructure/http/fastify/Routes';
import { DynamoDbRefreshTokensRepo } from '../infrastructure/dynamodb/repos/RefreshTokensRepo';
import { RefreshTokenRepository } from '../application/ports/RefreshTokenRepository';
import { Login } from '../application/usecases/Login.usecase';
import { RefreshToken } from '../application/usecases/RefreshToken.usecase';
import { AuthMiddleware } from '../infrastructure/http/fastify/middlewares/AuthMiddleware';
import { Logout } from '../application/usecases/Logout.usecase';
import { JwtService } from '../infrastructure/auth/JwtService';
import BcryptPasswordHasher from '../infrastructure/Hashing/BcryptPasswordHasher';

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
