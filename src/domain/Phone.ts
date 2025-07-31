export class Phone {
  private _value: string;

  constructor(value: string) {
    if (!this.isValid(value)) throw new Error("Phone does not meet criteria.");
    this._value = value;
  }

  private isValid(value: string): boolean {
    const cleaned = value.replace(/\D/g, "");

    // Strip leading "55" country code
    const normalized = cleaned.startsWith("55")
      ? cleaned.substring(2)
      : cleaned;

    // Regex for Brazilian landline (10 digits) and mobile (11 digits with leading 9 after DDD)
    const landlineRegex = /^(?:[1-9]{2})(?:[2-5]\d{3}\d{4})$/;
    const mobileRegex = /^(?:[1-9]{2})(?:9\d{4}\d{4})$/;

    return landlineRegex.test(normalized) || mobileRegex.test(normalized);
  }
  get value() {
    return this._value;
  }
}
