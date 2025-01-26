import 'express';
import { JwtPayload } from '../../auth/dto/jwt';

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}
