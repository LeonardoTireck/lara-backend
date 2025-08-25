import express, { Request, Response } from "express";
import { CreateUser } from "./application/usecases/CreateUser.usecase";
import "dotenv/config";
import BcryptPasswordHasher from "./infrastructure/Hashing/BcryptPasswordHasher";
import { DynamoDbUserRepo } from "./infrastructure/dynamodb/UserRepo";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const repo = new DynamoDbUserRepo();
const hasher = new BcryptPasswordHasher(+process.env.BCRYPT_SALTROUNDS!);

app.get("/users", async (req: Request, res: Response) => {
  const users = await repo.getAll();

  res.json(users);
});

app.post("/newUser", async (req: Request, res: Response) => {
  const body = req.body;
  const createUserUseCase = new CreateUser(repo, hasher);

  const outputCreateUser = await createUserUseCase.execute(body);
  res.json(outputCreateUser);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
