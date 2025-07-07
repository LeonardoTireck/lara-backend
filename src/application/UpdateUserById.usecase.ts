import { UserRepository } from "../domain/UserRepository";
import { FindUserById } from "./FindUserById.usecase";

export class UpdateUserById {
  constructor(private UserRepo: UserRepository) {}

  async execute(input: Input): Promise<Output> {
    const findUserByIdUsecase = new FindUserById(this.UserRepo);
    const userId = {
      userId: input.id,
    };
    const user = await findUserByIdUsecase.execute(userId);
    if (!user) throw new Error("User not found.");

    const updatedUser = {
      id: user.id,
      name: user.name,
      email: input.email || user?.email,
      password: input.password || user?.password,
    };

    this.UserRepo.delete(user.id);
    this.UserRepo.save(updatedUser);

    return updatedUser;
  }
}
type Input = { id: string; email?: string; password?: string };

type Output = {
  id: string;
  name: string;
  email: string;
  password: string;
};
