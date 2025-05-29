import { IRepository } from '../../../core/shared/interfaces/repository';
import { Task } from '../../../core/tasks/entities/Task';
import { TaskStatus } from '../../../core/tasks/enums/task-status';

export interface ITaskRepository extends IRepository<Task> {
  findByStatus(status: TaskStatus): Promise<Task[]>;
  findByDueDateRange(startDate: Date, endDate: Date): Promise<Task[]>;
  updateStatus(id: string, status: TaskStatus): Promise<Task | null>;
}

