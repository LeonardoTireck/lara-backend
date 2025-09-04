import { TrainingSession } from '../../domain/TrainingSession';
import { UserRepository } from '../ports/UserRepository';

export class UpdateTrainingSessions {
    constructor(private userRepo: UserRepository) {}

    async execute(userId: string, updatedTrainingSessions: TrainingSession[]) {
        const user = await this.userRepo.getById(userId);
        if (!user) throw new Error('User not found.');

        user.updateTrainingSessions(updatedTrainingSessions);
        this.userRepo.update(user);
        return user;
    }
}
