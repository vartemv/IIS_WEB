import { DecodedToken } from '@/utils/types/auth';
import { SignJWT, jwtVerify } from 'jose';

export const TokenService = {
    async create(payload: object, expiresIn: string = '72h') {
      const secret = new TextEncoder().encode(process.env.USER_SALT || 'tester');
      const token = await new SignJWT({payload}) // details to  encode in the token
      .setProtectedHeader({ alg: 'HS256' }) // algorithm
      .setIssuedAt() // token expiration time, e.g., "1 day"
      .setExpirationTime(expiresIn)
      .sign(secret); // secretKey generated from previous step
      return token;
      },
      async verify(token: string) {
        try {
          const secret = new TextEncoder().encode(process.env.USER_SALT || 'tester');
          const { payload } = await jwtVerify(token, secret);
          return payload.payload as DecodedToken;
        } catch (err) {
          console.error("Token verification error:", err);
          return null;
        }
      }
}