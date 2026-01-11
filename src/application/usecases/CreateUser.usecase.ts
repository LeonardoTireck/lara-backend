import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { User } from '../../domain/aggregates/user';
import { Password } from '../../domain/valueObjects/password';
import { TrainingPlan } from '../../domain/valueObjects/trainingPlan';
import { UserType } from '../../domain/valueObjects/userType';
import { UserRepository } from '../ports/userRepository';
import { ValidationError } from '../errors/appError';
import { ConflictError } from '../errors/appError';
import PasswordHasher from '../ports/passwordHasher';

@injectable()
export class CreateUser {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepo: UserRepository,
    @inject(TYPES.PasswordHasher)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: Input): Promise<Output> {
    if (input.userType !== undefined && input.userType !== 'admin') {
      throw new ValidationError('Invalid user type.');
    }
    const existingUser = await this.userRepo.getByEmail(input.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists.');
    }
    const newPassword = new Password(input.password).value;
    const hashedPassword = await this.passwordHasher.hash(newPassword);
    const activePlan = TrainingPlan.create(
      input.activePlan.planType,
      input.activePlan.paymentMethod,
    );

    const user = User.create(
      input.name,
      input.email,
      input.documentCPF,
      input.phone,
      input.dateOfBirth,
      hashedPassword,
      activePlan,
      input.userType ? input.userType : 'client',
    );

    await this.userRepo.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      activePlan: user.activePlan,
    };
  }
}
interface Input {
  name: string;
  email: string;
  password: string;
  documentCPF: string;
  phone: string;
  dateOfBirth: Date;
  activePlan: {
    planType: 'silver' | 'gold' | 'diamond';
    paymentMethod: 'PIX' | 'card';
  };
  userType?: UserType;
}

interface Output {
  id: string;
  name: string;
  email: string;
  activePlan?: TrainingPlan;
}
