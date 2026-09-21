import { Task } from '../../../core/tasks/entities/Task';
import { CreateTaskDto } from '../dtos/CreateTaskDto';
import { TaskStatus } from '../../../core/tasks/enums/task-status';

export interface ITaskService {
  getAllTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(taskDto: CreateTaskDto): Promise<Task>;
  updateTask(id: string, taskDto: Partial<CreateTaskDto>): Promise<Task | null>;
  deleteTask(id: string): Promise<boolean>;
  getTasksByStatus(status: TaskStatus): Promise<Task[]>;
  getTasksByDueDateRange(startDate: Date, endDate: Date): Promise<Task[]>;
  updateTaskStatus(id: string, status: TaskStatus): Promise<Task | null>;
}
