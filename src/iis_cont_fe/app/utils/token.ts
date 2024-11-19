import { DecodedToken } from '@/utils/types/auth';
import jwt from 'jsonwebtoken';

export const TokenService = {
    create(payload: object, expiresIn: string = '72h') {
        const secret = process.env.USER_SALT;
        if(!secret){
          console.log("Env doesn't work")
          return jwt.sign(payload, "tester", { expiresIn });
        }
        return jwt.sign(payload, secret, { expiresIn });
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