import { Password } from "../../../src/domain/Password";

describe("Password Value Object", () => {
  describe("Valid Passwords", () => {
    it("should create a valid password that meets all criteria", () => {
      const passwordValue = "ValidPass1!";
      const password = new Password(passwordValue);
      expect(password.value).toBe(passwordValue);
    });
  });

  describe("Invalid Passwords", () => {
    it.each([
      ["too short", "Val1!"],
      ["no uppercase", "validpass1!"],
      ["no lowercase", "VALIDPASS1!"],
      ["no number", "ValidPass!"],
      ["no symbol", "ValidPass1"],
    ])("should throw an error if password is %s", (_, invalidPassword) => {
      expect(() => new Password(invalidPassword)).toThrow(
        "Password does not meet criteria.",
      );
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
});