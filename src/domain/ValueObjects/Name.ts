import { ValidationError } from '../../application/errors/AppError';

export class Name {
  private _value: string;

  constructor(value: string) {
    if (!this.isValid(value))
      throw new ValidationError('Name does not meet criteria.');
    this._value = value;
  }

  private isValid(value: string) {
    const trimmed = value.trim().replace(/\s+/g, ' ');
    const words = trimmed.split(' ');
    if (words.length < 2) return false;
    const nameRegex = /^[A-Za-zÀ-ÿ]+([' -]?[A-Za-zÀ-ÿ]+)*$/;
    return words.every((word) => nameRegex.test(word));
  }

  get value() {
    return this._value;
  }
}
