import { Password } from "../../../src/domain/Password";

describe("Password", () => {
  it("should create a valid password", () => {
    const passwordValue = "ValidPass1!";
    const password = new Password(passwordValue);
    expect(password.value).toBe(passwordValue);
  });

  it("should throw an error if password is too short", () => {
    const invalidPassword = "Val1!";
    expect(() => new Password(invalidPassword)).toThrow("Password does not meet criteria.");
  });

  it("should throw an error if password does not have an uppercase letter", () => {
    const invalidPassword = "validpass1!";
    expect(() => new Password(invalidPassword)).toThrow("Password does not meet criteria.");
  });

  it("should throw an error if password does not have a lowercase letter", () => {
    const invalidPassword = "VALIDPASS1!";
    expect(() => new Password(invalidPassword)).toThrow("Password does not meet criteria.");
  });

  it("should throw an error if password does not have a number", () => {
    const invalidPassword = "ValidPass!";
    expect(() => new Password(invalidPassword)).toThrow("Password does not meet criteria.");
  });

  it("should throw an error if password does not have a symbol", () => {
    const invalidPassword = "ValidPass1";
    expect(() => new Password(invalidPassword)).toThrow("Password does not meet criteria.");
  });

  it("should throw an error for a null value", () => {
    const invalidPassword = null as any;
    expect(() => new Password(invalidPassword)).toThrow();
  });

  it("should throw an error for an undefined value", () => {
    const invalidPassword = undefined as any;
    expect(() => new Password(invalidPassword)).toThrow();
  });
});
