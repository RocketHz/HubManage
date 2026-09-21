import { inject, injectable } from 'inversify';
import { DataSource, Repository, Between } from 'typeorm';
import { Task } from '../../../core/tasks/entities/Task';
import { ITaskRepository } from '../../../application/tasks/interfaces/ITaskRepository';
import { TaskStatus } from '../../../core/tasks/enums/task-status';
import { TYPES } from '../../../shared/dependency-injection/types';

@injectable()
export class PgTaskRepository implements ITaskRepository {
  private repository: Repository<Task>;

  constructor(
    @inject(TYPES.DataSource) dataSource: DataSource
  ) {
    this.repository = dataSource.getRepository(Task);
  }

  async findAll(): Promise<Task[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Task | null> {
    return this.repository.findOneBy({ id });
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    return this.repository.find({ where: { status } });
  }

  async findByDueDateRange(startDate: Date, endDate: Date): Promise<Task[]> {
    return this.repository.find({
      where: {
        dueDate: Between(startDate, endDate)
      }
    });
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async save(entity: Task): Promise<Task> {
    return this.repository.save(entity);
  }

  async update(id: string, entity: Partial<Task>): Promise<Task | null> {
    await this.repository.update(id, entity);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}
