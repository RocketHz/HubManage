import { inject, injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../../core/users/entities/User';
import { IUserRepository } from '../../../application/users/interfaces/IUserRepository';
import { TYPES } from '../../../shared/dependency-injection/types';

@injectable()
export class PgUserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor(
    @inject(TYPES.DataSource) dataSource: DataSource
  ) {
    this.repository = dataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOneBy({ username });
  }

  async save(entity: User): Promise<User> {
    return this.repository.save(entity);
  }

  async update(id: string, entity: Partial<User>): Promise<User | null> {
    await this.repository.update(id, entity);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async addRole(userId: string, role: string): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }

    if (!user.roles.includes(role)) {
      user.roles.push(role);
      return this.repository.save(user);
    }

    return user;
  }

  async removeRole(userId: string, role: string): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }

    user.roles = user.roles.filter(r => r !== role);
    return this.repository.save(user);
  }
}