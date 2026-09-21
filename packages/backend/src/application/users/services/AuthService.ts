import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../core/users/entities/User';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IAuthService, AuthResult } from '../interfaces/IAuthService';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { TYPES } from '../../../shared/dependency-injection/types';
import { IPasswordHasher } from '../../../infrastructure/security/password-hasher';
import { ITokenGenerator } from '../../../infrastructure/security/token-generator';
import { AppError } from '../../../presentation/middlewares/errorHandler';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.PasswordHasher) private passwordHasher: IPasswordHasher,
    @inject(TYPES.TokenGenerator) private tokenGenerator: ITokenGenerator
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResult> {
    const existing = await this.userRepository.findByUsername(createUserDto.username);
    if (existing) {
      throw new AppError('Username already exists', 409);
    }

    const existingEmail = await this.userRepository.findByEmail(createUserDto.email);
    if (existingEmail) {
      throw new AppError('Email already exists', 409);
    }

    const passwordHash = await this.passwordHasher.hash(createUserDto.password);
    const user = new User(
      uuidv4(),
      createUserDto.username,
      createUserDto.email,
      passwordHash,
      ['user']
    );

    const savedUser = await this.userRepository.save(user);
    return this.buildAuthResult(savedUser);
  }

  async login(username: string, password: string): Promise<AuthResult> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const valid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError('Invalid credentials', 401);
    }

    return this.buildAuthResult(user);
  }

  async verifyToken(token: string): Promise<{ userId: string; roles: string[] }> {
    const payload = this.tokenGenerator.verify(token);
    return { userId: payload.userId, roles: payload.roles };
  }

  private buildAuthResult(user: User): AuthResult {
    const token = this.tokenGenerator.generate({
      userId: user.id,
      username: user.username,
      roles: user.roles
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles
      }
    };
  }
}