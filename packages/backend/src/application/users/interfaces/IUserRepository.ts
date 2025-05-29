import { IRepository } from '../../../core/shared/interfaces/repository';
import { User } from '../../../core/users/entities/User';

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  addRole(userId: string, role: string): Promise<User | null>;
  removeRole(userId: string, role: string): Promise<User | null>;
}

