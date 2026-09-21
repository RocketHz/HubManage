import { User } from '../../../core/users/entities/User';
import { CreateUserDto } from '../dtos/CreateUserDto';

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(userDto: CreateUserDto): Promise<User>;
  updateUser(id: string, userDto: Partial<CreateUserDto>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  addRole(userId: string, role: string): Promise<User | null>;
  removeRole(userId: string, role: string): Promise<User | null>;
}