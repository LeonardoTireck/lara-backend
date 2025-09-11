import {
  AppError,
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../../../src/application/errors/AppError';

describe('AppError Classes', () => {
  describe('AppError', () => {
    it('should create an instance with default status code 500', () => {
      const error = new AppError('Generic error');
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Generic error');
      expect(error.statusCode).toBe(500);
      expect(error.details).toBeUndefined();
    });

    it('should create an instance with a specific status code', () => {
      const error = new AppError('Specific error', 418);
      expect(error.statusCode).toBe(418);
    });

    it('should create an instance with details', () => {
      const details = { info: 'some details' };
      const error = new AppError('Detailed error', 500, details);
      expect(error.details).toEqual(details);
    });
  });

  describe('NotFoundError', () => {
    it('should create an instance with the correct message and status code', () => {
      const error = new NotFoundError('Resource');
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
    });

    it('should create an instance with details', () => {
      const details = { id: '123' };
      const error = new NotFoundError('Resource', details);
      expect(error.details).toEqual(details);
    });
  });

  describe('UnauthorizedError', () => {
    it('should create an instance with the default message', () => {
      const error = new UnauthorizedError();
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error.message).toBe('Unauthorized');
      expect(error.statusCode).toBe(401);
    });

    it('should create an instance with a custom message', () => {
      const error = new UnauthorizedError('Invalid credentials');
      expect(error.message).toBe('Invalid credentials');
    });
  });

  describe('ValidationError', () => {
    it('should create an instance with details and correct message/status', () => {
      const details = { field: 'email', issue: 'is required' };
      const error = new ValidationError(details);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual(details);
    });
  });

  describe('BadRequestError', () => {
    it('should create an instance with the correct message and status code', () => {
      const error = new BadRequestError('Invalid request parameter');
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe('Invalid request parameter');
      expect(error.statusCode).toBe(400);
    });

    it('should create an instance with details', () => {
      const details = { param: 'id' };
      const error = new BadRequestError('Invalid ID', details);
      expect(error.details).toEqual(details);
    });
  });

  describe('ConflictError', () => {
    it('should create an instance with the correct message and status code', () => {
      const error = new ConflictError('Resource already exists');
      expect(error).toBeInstanceOf(ConflictError);
      expect(error.message).toBe('Resource already exists');
      expect(error.statusCode).toBe(409);
    });

    it('should create an instance with details', () => {
      const details = { email: 'test@example.com' };
      const error = new ConflictError('Email in use', details);
      expect(error.details).toEqual(details);
    });
  });
});
