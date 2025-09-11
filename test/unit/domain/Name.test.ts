import { ValidationError } from '../../../src/application/errors/AppError';
import { Name } from '../../../src/domain/ValueObjects/Name';

describe('Name Value Object', () => {
  describe('Valid Names', () => {
    it('should create a valid name', () => {
      const nameValue = 'John Doe';
      const name = new Name(nameValue);
      expect(name.value).toBe(nameValue);
    });

    it('should create a valid name with accented characters', () => {
      const nameValue = 'Sébastien Loeb';
      const name = new Name(nameValue);
      expect(name.value).toBe(nameValue);
    });

    it('should create a valid name with an apostrophe', () => {
      const nameValue = "Miles O'Brien";
      const name = new Name(nameValue);
      expect(name.value).toBe(nameValue);
    });

    it('should create a valid name with a hyphen', () => {
      const nameValue = 'Jean-Luc Picard';
      const name = new Name(nameValue);
      expect(name.value).toBe(nameValue);
    });

    it('should handle extra whitespace between names', () => {
      const nameValue = 'John    Doe';
      const name = new Name(nameValue);
      expect(name.value).toBe(nameValue);
    });

    it('should handle leading and trailing whitespace', () => {
      const nameValue = '  John Doe  ';
      const name = new Name(nameValue);
      expect(name.value).toBe(nameValue);
    });
  });

  describe('Invalid Names', () => {
    it('should throw an error for a single name', () => {
      const invalidName = 'John';
      expect(() => new Name(invalidName)).toThrow(ValidationError);
    });

    it('should throw an error for a name with numbers', () => {
      const invalidName = 'John Doe123';
      expect(() => new Name(invalidName)).toThrow(ValidationError);
    });

    it('should throw an error for a name with invalid special characters', () => {
      const invalidName = 'John_Doe';
      expect(() => new Name(invalidName)).toThrow(ValidationError);
    });

    it('should throw an error for an empty string', () => {
      const invalidName = '';
      expect(() => new Name(invalidName)).toThrow(ValidationError);
    });

    it('should throw a TypeError for a null value', () => {
      const invalidName = null as any;
      expect(() => new Name(invalidName)).toThrow(TypeError);
    });

    it('should throw a TypeError for an undefined value', () => {
      const invalidName = undefined as any;
      expect(() => new Name(invalidName)).toThrow(TypeError);
    });
  });
});