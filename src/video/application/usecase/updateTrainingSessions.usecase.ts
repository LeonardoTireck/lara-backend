import { injectable, inject } from 'inversify';
import { NotFoundError } from '../../../error/appError';
import { TYPES } from '../../../di/types';
import { UserRepository } from '../../../user/application/interface/userRepository';
import { TrainingSession } from '../../../user/domain/trainingSession';

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
