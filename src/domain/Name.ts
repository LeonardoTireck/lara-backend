export class Name {
  private _value: string;

  constructor(value: string) {
    console.log("Creating a new name with:", value);
    if (!this.isValid(value)) throw new Error("Name does not meet criteria.");
    this._value = value;
  }

  private isValid(value: string) {
    const trimmed = value.trim().replace(/\s+/g, " ");
    const words = trimmed.split(" ");
    if (words.length < 2) return false;
    const nameRegex = /^[A-Za-zÀ-ÿ]+(['-]?[A-Za-zÀ-ÿ]+)*$/;
    return words.every((word) => nameRegex.test(word));
  }

  get value() {
    return this._value;
  }
}
