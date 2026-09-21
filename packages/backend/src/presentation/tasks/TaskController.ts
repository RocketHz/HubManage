import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../shared/dependency-injection/types';
import { ITaskService } from '../../application/tasks/interfaces/ITaskService';
import { CreateTaskDto } from '../../application/tasks/dtos/CreateTaskDto';
import { UpdateTaskDto } from '../../application/tasks/dtos/UpdateTaskDto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { TaskStatus } from '../../core/tasks/enums/task-status';

@injectable()
export class TaskController {
  constructor(
    @inject(TYPES.TaskService) private taskService: ITaskService
  ) {}

  getAllTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const task = await this.taskService.getTaskById(id);

      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskDto = plainToClass(CreateTaskDto, req.body);
      const errors = await validate(taskDto);

      if (errors.length > 0) {
        res.status(400).json({
          message: 'Validation failed',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }

      const task = await this.taskService.createTask(taskDto);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const taskDto = plainToClass(UpdateTaskDto, req.body);
      const errors = await validate(taskDto, { skipMissingProperties: true });

      if (errors.length > 0) {
        res.status(400).json({
          message: 'Validation failed',
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }

      const updatedTask = await this.taskService.updateTask(id, taskDto);

      if (!updatedTask) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.taskService.deleteTask(id);

      if (!result) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getTasksByStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status } = req.params;

      if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
        res.status(400).json({ message: 'Invalid task status' });
        return;
      }

      const tasks = await this.taskService.getTasksByStatus(status as TaskStatus);
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  getTasksByDueDateRange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({ message: 'startDate and endDate query parameters are required' });
        return;
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({ message: 'startDate and endDate must be valid dates' });
        return;
      }

      const tasks = await this.taskService.getTasksByDueDateRange(start, end);
      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  updateTaskStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !Object.values(TaskStatus).includes(status as TaskStatus)) {
        res.status(400).json({ message: 'Invalid task status' });
        return;
      }

      const updatedTask = await this.taskService.updateTaskStatus(id, status as TaskStatus);

      if (!updatedTask) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      next(error);
    }
  };
}
