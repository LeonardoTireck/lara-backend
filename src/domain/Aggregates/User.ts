import crypto from 'crypto';
import { BadRequestError } from '../../application/errors/appError';
import { Document } from '../valueObjects/document';
import { Email } from '../valueObjects/email';
import { Name } from '../valueObjects/name';
import { Parq } from '../valueObjects/parq';
import { Phone } from '../valueObjects/phone';
import { TrainingPlan } from '../valueObjects/trainingPlan';
import { TrainingSession } from '../valueObjects/trainingSession';
import { UserType } from '../valueObjects/userType';

export class User {
  private _name: Name;
  private _email: Email;
  private _documentCPF: Document;
  private _phone: Phone;
  private _hashedPassword: string;

  constructor(
    readonly id: string,
    readonly userType: UserType,
    name: string,
    readonly dateOfFirstPlanIngress: Date,
    documentCPF: string,
    readonly dateOfBirth: Date,
    email: string,
    phone: string,
    hashedPassword: string,
    private _activePlan?: TrainingPlan,
    private _pastPlans: TrainingPlan[] = [],
    private _parq?: Parq,
    private _lastParqUpdate?: Date,
    private _trainingSessions: TrainingSession[] = [],
  ) {
    this._name = new Name(name);
    this._email = new Email(email);
    this._documentCPF = new Document(documentCPF);
    this._phone = new Phone(phone);
    this._hashedPassword = hashedPassword;
  }

  static create(
    name: string,
    email: string,
    documentCPF: string,
    phone: string,
    dateOfBirth: Date,
    password: string,
    activePlan: TrainingPlan,
    userType: UserType,
  ) {
    const id = crypto.randomUUID();

    return new User(
      id,
      userType,
      name,
      new Date(),
      documentCPF,
      dateOfBirth,
      email,
      phone,
      password,
      activePlan,
    );
  }

  static createAdmin(
    name: string,
    email: string,
    documentCPF: string,
    phone: string,
    dateOfBirth: Date,
    password: string,
  ) {
    const id = crypto.randomUUID();

    return new User(
      id,
      'admin',
      name,
      new Date(),
      documentCPF,
      dateOfBirth,
      email,
      phone,
      password,
    );
  }

  get name() {
    return this._name.value;
  }

  get email() {
    return this._email.value;
  }

  get documentCPF() {
    return this._documentCPF.value;
  }

  get phone() {
    return this._phone.value;
  }

  get hashedPassword() {
    return this._hashedPassword;
  }

  get trainingSessions() {
    return [...this._trainingSessions];
  }

  get parq() {
    return this._parq;
  }

  get lastParqUpdate() {
    return this._lastParqUpdate;
  }

  get activePlan() {
    return this._activePlan;
  }

  get pastPlans() {
    return [...this._pastPlans];
  }

  updateEmail(newEmail: string) {
    this._email = new Email(newEmail);
  }

  updatePhone(newPhone: string) {
    this._phone = new Phone(newPhone);
  }

  updatePassword(newHashedPasword: string) {
    this._hashedPassword = newHashedPasword;
  }

  updateTrainingSessions(trainingSessions: TrainingSession[]) {
    this._trainingSessions = trainingSessions;
  }

  addTrainingSession(trainingSession: TrainingSession) {
    this._trainingSessions.push(trainingSession);
  }

  updateParq(newParq: Parq) {
    if (!newParq) throw new BadRequestError('Invalid Parq');
    this._parq = newParq;
    this._lastParqUpdate = new Date();
  }

  refreshPlans() {
    if (!this._activePlan)
      throw new BadRequestError("There isn't an active plan.");
    if (this._activePlan.expirationDate < new Date()) {
      this._pastPlans.push(this._activePlan);
      this._activePlan = undefined;
    }
  }

  updateActivePlan(newPlan: TrainingPlan) {
    this._activePlan = newPlan;
  }

  static fromRaw(data: any): User {
    if (!data) return data;
    const user = new User(
      data.id,
      data.userType,
      data.name,
      data.dateOfFirstPlanIngress,
      data.documentCPF,
      data.dateOfBirth,
      data.email,
      data.phone,
      data.hashedPassword,
      data.activePlan
        ? TrainingPlan.fromRaw({
            ...data.activePlan,
            startDate: new Date(data.activePlan.startDate),
            expirationDate: new Date(data.activePlan.expirationDate),
          })
        : undefined,
      data.pastPlans
        ? data.pastPlans.map((plan: any) =>
            TrainingPlan.fromRaw({
              ...plan,
              startDate: plan.startDate,
              expirationDate: plan.expirationDate,
            }),
          )
        : [],
      data.parq ? Parq.fromRaw(data.parq) : undefined,
      data.lastParqUpdate,
      data.trainingSessions
        ? data.trainingSessions.map((session: any) =>
            TrainingSession.fromRaw(session),
          )
        : [],
    );
    return user;
  }
}
