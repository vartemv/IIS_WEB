import { DecodedToken } from '@/utils/types/auth';
import jwt from 'jsonwebtoken';

export const TokenService = {
    create(payload: object, secret: string = "Test", expiresIn: string = '72h') {
        return jwt.sign(payload, "secret", { expiresIn });
      },
      verify(token: string, secret: string = "Default") {
        try {
          return jwt.verify(token, "secret") as DecodedToken;
        } catch (err) {
          console.error("Token verification error:", err);
          return null;
        }
      }
}