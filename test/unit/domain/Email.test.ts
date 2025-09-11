import { Email } from '../../../src/domain/ValueObjects/Email';

describe('Email Value Object', () => {
  describe('Valid Emails', () => {
    it('should create a valid email', () => {
      const emailValue = 'test@example.com';
      const email = new Email(emailValue);
      expect(email.value).toBe(emailValue);
    });

    it('should create a valid email with subdomains', () => {
      const emailValue = 'test@sub.example.co.uk';
      const email = new Email(emailValue);
      expect(email.value).toBe(emailValue);
    });

    it('should create a valid email with numbers in the local part', () => {
      const emailValue = 'test123@example.com';
      const email = new Email(emailValue);
      expect(email.value).toBe(emailValue);
    });

    it('should create a valid email with special characters in the local part', () => {
      const emailValue = 'test.name+alias@example.com';
      const email = new Email(emailValue);
      expect(email.value).toBe(emailValue);
    });
  });

  describe('Invalid Emails', () => {
    it('should throw an error for an email without an @ symbol', () => {
      const invalidEmail = 'testexample.com';
      expect(() => new Email(invalidEmail)).toThrow(
        'Email does not meet criteria.',
      );
    });

    it('should throw an error for an email with multiple @ symbols', () => {
      const invalidEmail = 'test@exa@mple.com';
      expect(() => new Email(invalidEmail)).toThrow(
        'Email does not meet criteria.',
      );
    });

    it('should throw an error for an email without a domain', () => {
      const invalidEmail = 'test@';
      expect(() => new Email(invalidEmail)).toThrow(
        'Email does not meet criteria.',
      );
    });

    it('should throw an error for an email without a top-level domain', () => {
      const invalidEmail = 'test@example';
      expect(() => new Email(invalidEmail)).toThrow(
        'Email does not meet criteria.',
      );
    });

    it('should throw an error for an email with invalid characters in the domain', () => {
      const invalidEmail = 'test@exa_mple.com';
      expect(() => new Email(invalidEmail)).toThrow(
        'Email does not meet criteria.',
      );
    });

    it('should throw an error for an empty string', () => {
      const invalidEmail = '';
      expect(() => new Email(invalidEmail)).toThrow(
        'Email does not meet criteria.',
      );
    });

    it('should throw an error for a null value', () => {
      const invalidEmail = null as any;
      expect(() => new Email(invalidEmail)).toThrow();
    });

    it('should throw an error for an undefined value', () => {
      const invalidEmail = undefined as any;
      expect(() => new Email(invalidEmail)).toThrow();
    });
  });
});
