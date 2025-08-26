import { Name } from "../../../src/domain/Name";

describe("Name", () => {
  it("should create a valid name", () => {
    const nameValue = "John Doe";
    const name = new Name(nameValue);
    expect(name.value).toBe(nameValue);
  });

  it("should create a valid name with accented characters", () => {
    const nameValue = "Sébastien Loeb";
    const name = new Name(nameValue);
    expect(name.value).toBe(nameValue);
  });

  it("should create a valid name with an apostrophe", () => {
    const nameValue = "Miles O'Brien";
    const name = new Name(nameValue);
    expect(name.value).toBe(nameValue);
  });

  it("should throw an error for a single name", () => {
    const invalidName = "John";
    expect(() => new Name(invalidName)).toThrow("Name does not meet criteria.");
  });

  it("should throw an error for a name with numbers", () => {
    const invalidName = "John Doe123";
    expect(() => new Name(invalidName)).toThrow("Name does not meet criteria.");
  });

  it("should throw an error for an empty string", () => {
    const invalidName = "";
    expect(() => new Name(invalidName)).toThrow("Name does not meet criteria.");
  });

  it("should handle extra whitespace between names", () => {
    const nameValue = "John    Doe";
    const name = new Name(nameValue);
    expect(name.value).toBe(nameValue);
  });

  it("should handle leading and trailing whitespace", () => {
    const nameValue = "  John Doe  ";
    const name = new Name(nameValue);
    expect(name.value).toBe(nameValue);
  });

  it("should throw an error for a null value", () => {
    const invalidName = null as any;
    expect(() => new Name(invalidName)).toThrow();
  });
});
