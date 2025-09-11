import { injectable, inject } from 'inversify';
import { NotFoundError } from '../errors/AppError';
import { TYPES } from '../../di/Types';
import { UserRepository } from '../ports/UserRepository';
import { TrainingSession } from '../../domain/ValueObjects/TrainingSession';

@injectable()
export class UpdateTrainingSessions {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepo: UserRepository,
  ) {}

  async execute(userId: string, updatedTrainingSessions: TrainingSession[]) {
    const user = await this.userRepo.getById(userId);
    if (!user) throw new NotFoundError('User');

    user.updateTrainingSessions(updatedTrainingSessions);
    this.userRepo.update(user);
    return user;
  }
}