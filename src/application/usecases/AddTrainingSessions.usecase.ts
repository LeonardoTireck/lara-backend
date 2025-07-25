import { TrainingSession } from "../../domain/TrainingSession";
import { UserRepository } from "../ports/UserRepository";

export class AddTrainingSession {
  constructor(private userRepo: UserRepository) {}

  async execute(userId: string, newTrainingSession: TrainingSession) {
    const user = await this.userRepo.getById(userId);
    if (!user) throw new Error("User not found.");

    user.addTrainingSession(newTrainingSession);
    this.userRepo.update(user);
    return user;
  }
}
