import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../core/users/entities/User';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IUserService } from '../interfaces/IUserService';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { TYPES } from '../../../shared/dependency-injection/types';
import { IPasswordHasher } from '../../../infrastructure/security/password-hasher';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.PasswordHasher) private passwordHasher: IPasswordHasher
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const passwordHash = await this.passwordHasher.hash(userDto.password);

    const user = new User(
      uuidv4(),
      userDto.username,
      userDto.email,
      passwordHash,
      ['user']
    );

    return this.userRepository.save(user);
  }

  async updateUser(id: string, userDto: Partial<CreateUserDto>): Promise<User | null> {
    const updates: Partial<User> = {};

    if (userDto.username !== undefined) {
      updates.username = userDto.username;
    }
    if (userDto.email !== undefined) {
      updates.email = userDto.email;
    }
    if (userDto.password !== undefined) {
      updates.passwordHash = await this.passwordHasher.hash(userDto.password);
    }

    return this.userRepository.update(id, updates);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async addRole(userId: string, role: string): Promise<User | null> {
    return this.userRepository.addRole(userId, role);
  }

  async removeRole(userId: string, role: string): Promise<User | null> {
    return this.userRepository.removeRole(userId, role);
  }
}