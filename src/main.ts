import { FastifyAdapter } from './infrastructure/http/fastify/api';
import { FindAllUsers } from './application/usecases/FindAllUsers.usecase';
import { DynamoDbUserRepo } from './infrastructure/dynamodb/repos/UserRepo';
import { CreateUser } from './application/usecases/CreateUser.usecase';
import 'dotenv/config';
import BcryptPasswordHasher from './infrastructure/hashing/BcryptPasswordHasher';
import { UserControllers } from './infrastructure/http/fastify/controllers/UserControllers';

async function startServer() {
    const userRepo = new DynamoDbUserRepo();

    const bcryptHasher = new BcryptPasswordHasher(1);

    const findAllUsersUseCase = new FindAllUsers(userRepo);
    const createUserUseCase = new CreateUser(userRepo, bcryptHasher);

    const userControllers = new UserControllers(
        findAllUsersUseCase,
        createUserUseCase,
    );

    const httpServer = new FastifyAdapter(userControllers);

    await httpServer.listen(+process.env.PORT!);
}

startServer();
