import { ValidationError } from '../../../src/error/appError';
import { Phone } from '../../../src/domain/valueObjects/phone';

describe('Phone Value Object', () => {
  describe('Valid Phone Numbers', () => {
    it.each([
      ['mobile number', '11987654321'],
      ['landline number', '1143215678'],
      ['formatted mobile number', '(11) 98765-4321'],
      ['mobile number with country code', '5511987654321'],
    ])('should create a valid %s', (_, phoneValue) => {
      const phone = new Phone(phoneValue);
      expect(phone.value).toBe(phoneValue);
    });
  });

  describe('Invalid Phone Numbers', () => {
    it.each([
      ['too few digits', '1198765432'],
      ['too many digits', '119876543210'],
      ['mobile without leading 9', '1187654321'],
      ['invalid area code (DDD)', '01987654321'],
      ['number with letters', '1198765432a'],
    ])('should throw an error for a number with %s', (_, invalidPhone) => {
      expect(() => new Phone(invalidPhone)).toThrow(ValidationError);
    });

    it('should throw a TypeError for a null value', () => {
      const invalidPhone = null as any;
      expect(() => new Phone(invalidPhone)).toThrow(TypeError);
    });

    it('should throw a TypeError for an undefined value', () => {
      const invalidPhone = undefined as any;
      expect(() => new Phone(invalidPhone)).toThrow(TypeError);
    });
  });
});
