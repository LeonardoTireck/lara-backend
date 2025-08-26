import { Document } from "../../../src/domain/Document";

describe("Document", () => {
  it("should create a valid document (CPF)", () => {
    const documentValue = "11144477735";
    const document = new Document(documentValue);
    expect(document.value).toBe(documentValue);
  });

  it("should create a valid document with formatting", () => {
    const documentValue = "111.444.777-35";
    const document = new Document(documentValue);
    expect(document.value).toBe(documentValue);
  });

  it("should throw an error for a document with incorrect length", () => {
    const invalidDocument = "1234567890";
    expect(() => new Document(invalidDocument)).toThrow("Document does not meet criteria.");
  });

  it("should throw an error for a document with all same digits", () => {
    const invalidDocument = "11111111111";
    expect(() => new Document(invalidDocument)).toThrow("Document does not meet criteria.");
  });

  it("should throw an error for a document with an invalid first verification digit", () => {
    const invalidDocument = "11144477745"; // Correct digit is 3
    expect(() => new Document(invalidDocument)).toThrow("Document does not meet criteria.");
  });

  it("should throw an error for a document with an invalid second verification digit", () => {
    const invalidDocument = "11144477736"; // Correct digit is 5
    expect(() => new Document(invalidDocument)).toThrow("Document does not meet criteria.");
  });

  it("should throw an error for a null value", () => {
    const invalidDocument = null as any;
    expect(() => new Document(invalidDocument)).toThrow();
  });
});
