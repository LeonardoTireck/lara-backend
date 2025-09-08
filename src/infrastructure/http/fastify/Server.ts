import { CreateUser } from '../../../application/usecases/CreateUser.usecase';
import { FindAllUsers } from '../../../application/usecases/FindAllUsers.usecase';
import { DynamoDbUserRepo } from '../../dynamodb/repos/UserRepo';
import BcryptPasswordHasher from '../../hashing/BcryptPasswordHasher';
import { FastifyAdapter } from './Adapter';
import { UserControllers } from './controllers/UserControllers';
import { createRoutes } from './Routes';

export async function instantiateServer() {
    const userRepo = new DynamoDbUserRepo();
    const bcryptHasher = new BcryptPasswordHasher(1);

    const findAllUsersUseCase = new FindAllUsers(userRepo);
    const createUserUseCase = new CreateUser(userRepo, bcryptHasher);

    const userControllers = new UserControllers(
        findAllUsersUseCase,
        createUserUseCase,
    );
    const v1Routes = createRoutes(userControllers);

    const httpServer = new FastifyAdapter();
    httpServer.register(v1Routes, '/v1');

    return httpServer;
}
