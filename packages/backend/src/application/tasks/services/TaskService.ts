import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../../core/tasks/entities/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { ITaskService } from '../interfaces/ITaskService';
import { CreateTaskDto } from '../dtos/CreateTaskDto';
import { TaskStatus } from '../../../core/tasks/enums/task-status';
import { TYPES } from '../../../shared/dependency-injection/types';

@injectable()
export class TaskService implements ITaskService {
  constructor(
    @inject(TYPES.TaskRepository) private taskRepository: ITaskRepository
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.taskRepository.findById(id);
  }

  async createTask(taskDto: CreateTaskDto): Promise<Task> {
    const task = new Task(
      uuidv4(),
      taskDto.title,
      taskDto.description,
      taskDto.dueDate,
      taskDto.status
    );

    return this.taskRepository.save(task);
  }

  async updateTask(id: string, taskDto: Partial<CreateTaskDto>): Promise<Task | null> {
    return this.taskRepository.update(id, taskDto);
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.taskRepository.delete(id);
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    return this.taskRepository.findByStatus(status);
  }

  async getTasksByDueDateRange(startDate: Date, endDate: Date): Promise<Task[]> {
    return this.taskRepository.findByDueDateRange(startDate, endDate);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task | null> {
    return this.taskRepository.updateStatus(id, status);
  }
}
