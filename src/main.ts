import { FastifyAdapter } from './infrastructure/http/fastify/api';
import { UserControllers } from './infrastructure/http/controllers/UserControllers';
import { FindAllUsers } from './application/usecases/FindAllUsers.usecase';
import { DynamoDbUserRepo } from './infrastructure/dynamodb/repos/UserRepo';
import { CreateUser } from './application/usecases/CreateUser.usecase';
import BcryptPasswordHasher from './infrastructure/Hashing/BcryptPasswordHasher';

async function startServer() {
    const userRepo = new DynamoDbUserRepo();
    const findAllUsersUseCase = new FindAllUsers(userRepo);
    const bcryptHasher = new BcryptPasswordHasher(1);
    const createUserUseCase = new CreateUser(userRepo, bcryptHasher);
    const userControllers = new UserControllers(
        findAllUsersUseCase,
        createUserUseCase,
    );
    const httpServer = new FastifyAdapter();

    httpServer.on('get', '/users', userControllers.getAll, []);
    httpServer.on('post', '/newUser', userControllers.newUser, []);
    await httpServer.listen(3001);
}

startServer();
