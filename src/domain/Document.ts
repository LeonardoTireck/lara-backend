export class Document {
  private _value: string;

  constructor(value: string) {
    if (!this.isValid(value))
      throw new Error("Document does not meet criteria.");
    this._value = value;
  }

  private isValid(value: string): boolean {
    const cleanCPF = value.replace(/[^\d]/g, "");
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    const digits = cleanCPF.split("").map(Number);
    const sum1 = digits
      .slice(0, 9)
      .reduce((acc, digit, i) => acc + digit * (10 - i), 0);
    const check1 = ((sum1 * 10) % 11) % 10;
    if (check1 !== digits[9]) return false;
    const sum2 = digits
      .slice(0, 10)
      .reduce((acc, digit, i) => acc + digit * (11 - i), 0);
    const check2 = ((sum2 * 10) % 11) % 10;
    if (check2 !== digits[10]) return false;
    return true;
  }
  get value() {
    return this._value;
  }
}
