import { injectable, inject } from 'inversify';
import { NotFoundError } from '../errors/AppError';
import { TYPES } from '../../di/Types';
import { Parq } from '../../domain/ValueObjects/Parq';
import { TrainingPlan } from '../../domain/ValueObjects/TrainingPlan';
import { TrainingSession } from '../../domain/ValueObjects/TrainingSession';
import { UserType } from '../../domain/ValueObjects/UserType';
import { UserRepository } from '../ports/UserRepository';

@injectable()
export class FindUserById {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepo: UserRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepo.getById(input.userId);
    if (!user) throw new NotFoundError('User');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      documentCPF: user.documentCPF,
      phone: user.phone,
      password: user.hashedPassword,
      dateOfBirth: user.dateOfBirth,
      userType: user.userType,
      dateOfFirstPlanIngress: user.dateOfFirstPlanIngress,
      activePlan: user.activePlan,
      pastPlans: user.pastPlans,
      lastParqUpdate: user.lastParqUpdate,
      trainingSessions: user.trainingSessions,
      parq: user.parq,
    };
  }
}

interface Input {
  userId: string;
}

interface Output {
  id: string;
  name: string;
  email: string;
  documentCPF: string;
  phone: string;
  password: string;
  dateOfBirth: Date;
  userType: UserType;
  dateOfFirstPlanIngress: Date;
  activePlan?: TrainingPlan;
  pastPlans: TrainingPlan[] | [];
  lastParqUpdate?: Date;
  trainingSessions?: TrainingSession[];
  parq?: Parq;
}