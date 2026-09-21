import { CreateUserDto } from '../dtos/CreateUserDto';

export interface AuthResult {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
}

export interface IAuthService {
  register(createUserDto: CreateUserDto): Promise<AuthResult>;
  login(username: string, password: string): Promise<AuthResult>;
  verifyToken(token: string): Promise<{ userId: string; roles: string[] }>;
}