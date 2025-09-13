import PasswordHasher from '../ports/PasswordHasher';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/Types';
import { User } from '../../domain/Aggregates/User';
import { Password } from '../../domain/ValueObjects/Password';
import { TrainingPlan } from '../../domain/ValueObjects/TrainingPlan';
import { UserType } from '../../domain/ValueObjects/UserType';
import { UserRepository } from '../ports/UserRepository';
import { ValidationError, ConflictError } from '../errors/AppError';

@injectable()
export class CreateUser {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepo: UserRepository,
    @inject(TYPES.PasswordHasher)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: Input): Promise<Output> {
    const existingUser = await this.userRepo.getByEmail(input.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists.');
    }
    const newPassword = new Password(input.password).value;
    const hashedPassword = await this.passwordHasher.hash(newPassword);
    if (input.userType !== undefined && input.userType !== 'admin') {
      throw new ValidationError('Invalid user type.');
    }

    const activePlan = TrainingPlan.create(
      input.activePlan.planType,
      input.activePlan.paymentMethod,
    );

    const user = User.create(
      input.name,
      input.email,
      input.documentCPF,
      input.phone,
      new Date(input.dateOfBirth),
      hashedPassword,
      activePlan,
      input.userType || 'client',
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
