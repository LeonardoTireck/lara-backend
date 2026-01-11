import 'express';
import { UserType } from '../domain/valueObjects/userType';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userType?: UserType;
    }
  }
}
