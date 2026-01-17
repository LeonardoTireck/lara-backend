import { injectable, inject } from 'inversify';
import { TYPES } from '../../../di/types';
import { NotFoundError } from '../../../error/appError';
import PasswordHasher from '../../../hashing/interface/passwordHasher';
import { Password } from '../../domain/password';
import { UserRepository } from '../interface/userRepository';

@injectable()
export class UpdateClientPersonalInfo {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepo: UserRepository,
    @inject(TYPES.PasswordHasher)
    private readonly passwordHasher: PasswordHasher,
  ) {}
  async execute(input: Input): Promise<void> {
    const user = await this.userRepo.getById(input.id);
    if (!user) throw new NotFoundError('User');

    if (input.email) {
      user.updateEmail(input.email);
    }
    if (input.phone) {
      user.updatePhone(input.phone);
    }
    if (input.plainTextPassword) {
      const newPassword = new Password(input.plainTextPassword);
      const newHashedPassword = await this.passwordHasher.hash(
        newPassword.value,
      );
      user.updatePassword(newHashedPassword);
    }
    this.userRepo.update(user);
  }
}

interface Input {
  id: string;
  email?: string;
  plainTextPassword?: string;
  phone?: string;
}
