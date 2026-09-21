import jwt, { SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  username: string;
  roles: string[];
}

export interface ITokenGenerator {
  generate(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}

export const TokenGenerator = Symbol('TokenGenerator');

export class JwtTokenGenerator implements ITokenGenerator {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor(secret?: string, expiresIn?: string) {
    this.secret = secret || process.env.JWT_SECRET || 'default_secret';
    this.expiresIn = expiresIn || process.env.JWT_EXPIRES_IN || '1d';
  }

  generate(payload: TokenPayload): string {
    const options: SignOptions = { expiresIn: this.expiresIn as SignOptions['expiresIn'] };
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): TokenPayload {
    return jwt.verify(token, this.secret) as TokenPayload;
  }
}