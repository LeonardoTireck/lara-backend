import 'express';
import { UserType } from '../domain/ValueObjects/UserType';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userType?: UserType;
    }
  }
}
