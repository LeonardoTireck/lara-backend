import { injectable, inject } from 'inversify';
import { NotFoundError } from '../errors/appError';
import { TYPES } from '../../di/types';
import { Parq } from '../../domain/valueObjects/parq';
import { TrainingPlan } from '../../domain/valueObjects/trainingPlan';
import { TrainingSession } from '../../domain/valueObjects/trainingSession';
import { UserType } from '../../domain/valueObjects/userType';
import { UserRepository } from '../ports/userRepository';

@injectable()
export class GetUserById {
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
