import { Container } from 'inversify';
import { TYPES } from './Types';
import { CreateUser } from '../application/usecases/CreateUser.usecase';
import { FindAllUsers } from '../application/usecases/FindAllUsers.usecase';
import { UserRepository } from '../application/ports/UserRepository';
import { DynamoDbUserRepo } from '../infrastructure/dynamodb/repos/UserRepo';
import BcryptPasswordHasher from '../infrastructure/hashing/BcryptPasswordHasher';
import PasswordHasher from '../application/ports/PasswordHasher';
import { UserControllers } from '../infrastructure/http/fastify/controllers/UserControllers';

const container = new Container();

container
    .bind<UserRepository>(TYPES.UserRepository)
    .to(DynamoDbUserRepo)
    .inSingletonScope();

container
    .bind<PasswordHasher>(TYPES.PasswordHasher)
    .toConstantValue(new BcryptPasswordHasher(10));

container
    .bind<FindAllUsers>(TYPES.FindAllUsersUseCase)
    .to(FindAllUsers)
    .inSingletonScope();
container
    .bind<CreateUser>(TYPES.CreateUserUseCase)
    .to(CreateUser)
    .inSingletonScope();

container
    .bind<UserControllers>(TYPES.UserControllers)
    .to(UserControllers)
    .inSingletonScope();

export { container };
