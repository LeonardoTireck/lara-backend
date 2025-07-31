import crypto from "crypto";
import { Parq } from "./Parq";
import { TrainingPlan } from "./TrainingPlan";
import { TrainingSession } from "./TrainingSession";
import { UserType } from "./UserType";
import { Name } from "./Name";
import { Email } from "./Email";
import { Document } from "./Document";
import { Phone } from "./Phone";

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
    if (!newParq) throw new Error("Invalid Parq");
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
