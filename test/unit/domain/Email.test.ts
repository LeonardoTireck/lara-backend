import { Email } from "../../../src/domain/Email";

describe("Email", () => {
  it("should create a valid email", () => {
    const emailValue = "test@example.com";
    const email = new Email(emailValue);
    expect(email.value).toBe(emailValue);
  });

  it("should throw an error for an email without an @ symbol", () => {
    const invalidEmail = "testexample.com";
    expect(() => new Email(invalidEmail)).toThrow("Email does not meet criteria.");
  });

  it("should throw an error for an email without a domain", () => {
    const invalidEmail = "test@";
    expect(() => new Email(invalidEmail)).toThrow("Email does not meet criteria.");
  });

  it("should throw an error for an email without a top-level domain", () => {
    const invalidEmail = "test@example";
    expect(() => new Email(invalidEmail)).toThrow("Email does not meet criteria.");
  });

  it("should throw an error for an empty string", () => {
    const invalidEmail = "";
    expect(() => new Email(invalidEmail)).toThrow("Email does not meet criteria.");
  });

  it("should throw an error for a null value", () => {
    const invalidEmail = null as any;
    expect(() => new Email(invalidEmail)).toThrow();
  });

  it("should throw an error for an undefined value", () => {
    const invalidEmail = undefined as any;
    expect(() => new Email(invalidEmail)).toThrow();
  });
});
