import { Phone } from "../../../src/domain/Phone";

describe("Phone", () => {
  it("should create a valid mobile phone number", () => {
    const phoneValue = "11987654321";
    const phone = new Phone(phoneValue);
    expect(phone.value).toBe(phoneValue);
  });

  it("should create a valid landline phone number", () => {
    const phoneValue = "1143215678";
    const phone = new Phone(phoneValue);
    expect(phone.value).toBe(phoneValue);
  });

  it("should create a valid phone number with formatting", () => {
    const phoneValue = "(11) 98765-4321";
    const phone = new Phone(phoneValue);
    expect(phone.value).toBe(phoneValue);
  });

  it("should create a valid phone number with country code", () => {
    const phoneValue = "5511987654321";
    const phone = new Phone(phoneValue);
    expect(phone.value).toBe(phoneValue);
  });

  it("should throw an error for a number with too few digits", () => {
    const invalidPhone = "1198765432";
    expect(() => new Phone(invalidPhone)).toThrow("Phone does not meet criteria.");
  });

  it("should throw an error for a number with too many digits", () => {
    const invalidPhone = "119876543210";
    expect(() => new Phone(invalidPhone)).toThrow("Phone does not meet criteria.");
  });

  it("should throw an error for a mobile number without the leading 9", () => {
    const invalidPhone = "1187654321";
    expect(() => new Phone(invalidPhone)).toThrow("Phone does not meet criteria.");
  });

  it("should throw an error for an invalid area code (DDD)", () => {
    const invalidPhone = "01987654321";
    expect(() => new Phone(invalidPhone)).toThrow("Phone does not meet criteria.");
  });

  it("should throw an error for a null value", () => {
    const invalidPhone = null as any;
    expect(() => new Phone(invalidPhone)).toThrow();
  });
});
