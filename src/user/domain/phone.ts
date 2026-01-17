import { ValidationError } from '../../error/appError';

export class Phone {
  private _value: string;

  constructor(value: string) {
    if (!this.isValid(value))
      throw new ValidationError('Phone does not meet criteria.');
    this._value = value;
  }

  private isValid(value: string): boolean {
    const cleaned = value.replace(/\D/g, '');

    const normalized = cleaned.startsWith('55')
      ? cleaned.substring(2)
      : cleaned;

    const landlineRegex = /^(?:[1-9]{2})(?:[2-5]\d{3}\d{4})$/;
    const mobileRegex = /^(?:[1-9]{2})(?:9\d{4}\d{4})$/;

    return landlineRegex.test(normalized) || mobileRegex.test(normalized);
  }
  get value() {
    return this._value;
  }
}
