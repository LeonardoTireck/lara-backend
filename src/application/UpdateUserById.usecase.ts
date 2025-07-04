import { UserRepository } from "../domain/UserRepository";
import { FindUserById } from "./FindUserById.usecase";

export class UpdateUserById {
  constructor(private UserRepo: UserRepository) {}

  async execute(input: { id: string; email?: string; password?: string }) {
    const findUserByIdUsecase = new FindUserById(this.UserRepo);

    const user = await findUserByIdUsecase.execute(input.id);

    if (!user) throw new Error("User not found");

    const updatedUser = {
      id: user?.id,
      name: user.name,
      email: input.email || user?.email,
      password: input.password || user?.password,
    };

    this.UserRepo.delete(user.id);
    this.UserRepo.save(updatedUser);

    return updatedUser;
  }
}
