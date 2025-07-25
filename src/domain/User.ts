import crypto from "crypto";
import { Parq } from "./Parq";
import { TrainingPlan } from "./TrainingPlan";
import { TrainingSession } from "./TrainingSession";
import { UserType } from "./UserType";
import { validateBrazilPhone } from "./ValidateBrazilPhone";
import { validateCPF } from "./ValidateCPF";
import { validateEmail } from "./ValidateEmail";
import { validateName } from "./ValidateName";

export class User {
  private constructor(
    readonly id: string,
    readonly userType: UserType,
    readonly name: string,
    readonly dateOfFirstPlanIngress: Date,
    readonly documentCPF: string,
    readonly dateOfBirth: Date,
    private _email: string,
    private _phone: string,
    private _hashedPassword: string,
    private _activePlan?: TrainingPlan,
    private _pastPlans: TrainingPlan[] = [],
    private _parq?: Parq,
    private _lastParqUpdate?: Date,
    private _trainingSessions: TrainingSession[] = [],
  ) {}

  static create(
    name: string,
    email: string,
    documentCPF: string,
    phone: string,
    dateOfBirth: Date,
    hashedPassword: string,
    activePlan: TrainingPlan,
    userType: UserType,
    dateOfFirstPlanIngress?: Date,
  ) {
    if (!validateName(name)) throw new Error("Name does not meet criteria");
    if (!validateEmail(email)) throw new Error("Email does not meet criteria.");
    if (!validateCPF(documentCPF))
      throw new Error("Document does not meet criteria.");
    if (!validateBrazilPhone(phone))
      throw new Error("Phone does not meet criteria.");

    const id = crypto.randomUUID();

    return new User(
      id,
      userType,
      name,
      dateOfFirstPlanIngress || new Date(),
      documentCPF,
      dateOfBirth,
      email,
      phone,
      hashedPassword,
      activePlan,
    );
  }

  get email() {
    return this._email;
  }

  get phone() {
    return this._phone;
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
    if (!validateEmail(newEmail))
      throw new Error("Email does not meet criteria.");
    this._email = newEmail;
  }

  updatePhone(newPhone: string) {
    if (!validateBrazilPhone(newPhone))
      throw new Error("Phone does not meet criteria.");
    this._phone = newPhone;
  }

  updatePassword(newHashedPassword: string) {
    if (!newHashedPassword || newHashedPassword.length < 10)
      throw new Error("Invalid hashed password");
    this._hashedPassword = newHashedPassword;
  }

  updateTrainingSessions(trainingSessions: TrainingSession[]) {
    this._trainingSessions = trainingSessions;
  }

  addTrainingSession(trainingSession: TrainingSession) {
    this._trainingSessions.push(trainingSession);
  }

  updateParq(newParq: Parq) {
    this._parq = newParq;
    this._lastParqUpdate = new Date();
  }

  refreshPlans() {
    if (!this._activePlan) throw new Error("There isn't an active plan.");
    if (this._activePlan.expirationDate < new Date()) {
      this._pastPlans.push(this._activePlan);
      this._activePlan = undefined;
    }
  }

  updateActivePlan(newPlan: TrainingPlan) {
    this._activePlan = newPlan;
  }
}
