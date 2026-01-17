import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { Parq } from '../../../domain/valueObjects/parq';
import { NotFoundError } from '../../../error/appError';
import { UserRepository } from '../../../user/application/interface/userRepository';

@injectable()
export class UpdateParq {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepo: UserRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepo.getById(input.userId);
    if (!user) throw new NotFoundError('User');

    user.updateParq(input.newParq);
    this.userRepo.update(user);

    return {
      userId: user.id,
      parq: user.parq!,
    };
  }
}

interface Input {
  userId: string;
  newParq: Parq;
}

interface Output {
  userId: string;
  parq: Parq;
}
