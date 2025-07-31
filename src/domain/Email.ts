export class Email {
  private _value: string;

  constructor(value: string) {
    if (!this.isValid(value)) throw new Error("Email does not meet criteria.");
    this._value = value;
  }

  private isValid(value: string) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
  }

  get value() {
    return this._value;
  }
}
