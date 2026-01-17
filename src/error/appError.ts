export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, details?: unknown) {
    super(`${resource} not found`, 404, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ValidationError extends AppError {
  constructor(details: unknown) {
    super('Validation failed', 400, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 409, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to access this resource') {
    super(message, 403);
  }
}
