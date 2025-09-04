import express, { Request, Response } from 'express';
import { CreateUser } from './application/usecases/CreateUser.usecase';
import 'dotenv/config';
import BcryptPasswordHasher from './infrastructure/Hashing/BcryptPasswordHasher';
import { DynamoDbUserRepo } from './infrastructure/dynamodb/repos/UserRepo';
import { FindAllUsers } from './application/usecases/FindAllUsers.usecase';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const repo = new DynamoDbUserRepo();
const hasher = new BcryptPasswordHasher(+process.env.BCRYPT_SALTROUNDS!);

app.get('/users', async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit
            ? parseInt(req.query.limit as string, 10)
            : 2;
        const nextKeyQuery = req.query.next_key as string;

        let exclusiveStartKey;
        if (nextKeyQuery) {
            const decodedKey = Buffer.from(nextKeyQuery, 'base64').toString(
                'utf8',
            );
            exclusiveStartKey = JSON.parse(decodedKey);
        }

        const getAllUsersUseCase = new FindAllUsers(repo);

        const paginatedOutput = await getAllUsersUseCase.execute({
            limit,
            exclusiveStartKey,
        });

        let nextKeyForClient;
        if (paginatedOutput.lastEvaluatedKey) {
            nextKeyForClient = Buffer.from(
                JSON.stringify(paginatedOutput.lastEvaluatedKey),
            ).toString();
        }
        res.json({
            users: paginatedOutput.users,
            next_key: nextKeyForClient,
        });
    } catch (error) {
        console.log('Error fetching users:', error);
        res.status(500).json({ message: 'An error occurred.' });
    }
});

app.post('/newUser', async (req: Request, res: Response) => {
    const body = req.body;
    body.dateOfBirth = new Date(body.dateOfBirth);
    body.activePlan.startDate = new Date(body.activePlan.startDate);
    body.activePlan.expirationDate = new Date(body.activePlan.expirationDate);
    const createUserUseCase = new CreateUser(repo, hasher);

    const outputCreateUser = await createUserUseCase.execute(body);
    res.json(outputCreateUser);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
