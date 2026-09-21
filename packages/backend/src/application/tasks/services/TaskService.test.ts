import { TaskService } from './TaskService';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { Task } from '../../../core/tasks/entities/Task';
import { TaskStatus } from '../../../core/tasks/enums/task-status';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: jest.Mocked<ITaskRepository>;

  const mockTask = new Task(
    'task-1',
    'Setup CI',
    'Configure continuous integration',
    new Date('2025-06-01T00:00:00Z'),
    TaskStatus.TODO
  );

  beforeEach(() => {
    taskRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByStatus: jest.fn(),
      findByDueDateRange: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn()
    } as jest.Mocked<ITaskRepository>;

    taskService = new TaskService(taskRepository);
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      taskRepository.findAll.mockResolvedValue([mockTask]);

      const tasks = await taskService.getAllTasks();

      expect(tasks).toEqual([mockTask]);
      expect(taskRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      taskRepository.findById.mockResolvedValue(mockTask);

      const task = await taskService.getTaskById('task-1');

      expect(task).toEqual(mockTask);
    });

    it('should return null when not found', async () => {
      taskRepository.findById.mockResolvedValue(null);

      const task = await taskService.getTaskById('missing');

      expect(task).toBeNull();
    });
  });

  describe('createTask', () => {
    it('should create and save a new task', async () => {
      taskRepository.save.mockResolvedValue(mockTask);

      const task = await taskService.createTask({
        title: 'Setup CI',
        description: 'Configure continuous integration',
        dueDate: new Date('2025-06-01T00:00:00Z'),
        status: TaskStatus.TODO
      });

      expect(taskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Setup CI',
          status: TaskStatus.TODO
        })
      );
      expect(task).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update and return the task', async () => {
      const updated = { ...mockTask, title: 'Setup CI/CD' };
      taskRepository.update.mockResolvedValue(updated);

      const result = await taskService.updateTask('task-1', { title: 'Setup CI/CD' });

      expect(taskRepository.update).toHaveBeenCalledWith('task-1', { title: 'Setup CI/CD' });
      expect(result).toEqual(updated);
    });

    it('should return null if task does not exist', async () => {
      taskRepository.update.mockResolvedValue(null);

      const result = await taskService.updateTask('missing', { title: 'X' });

      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete the task', async () => {
      taskRepository.delete.mockResolvedValue(true);

      const result = await taskService.deleteTask('task-1');

      expect(result).toBe(true);
    });

    it('should return false when task does not exist', async () => {
      taskRepository.delete.mockResolvedValue(false);

      const result = await taskService.deleteTask('missing');

      expect(result).toBe(false);
    });
  });

  describe('getTasksByStatus', () => {
    it('should return tasks filtered by status', async () => {
      taskRepository.findByStatus.mockResolvedValue([mockTask]);

      const result = await taskService.getTasksByStatus(TaskStatus.TODO);

      expect(taskRepository.findByStatus).toHaveBeenCalledWith(TaskStatus.TODO);
      expect(result).toEqual([mockTask]);
    });
  });

  describe('getTasksByDueDateRange', () => {
    it('should return tasks within the date range', async () => {
      const start = new Date('2025-05-01T00:00:00Z');
      const end = new Date('2025-07-01T00:00:00Z');
      taskRepository.findByDueDateRange.mockResolvedValue([mockTask]);

      const result = await taskService.getTasksByDueDateRange(start, end);

      expect(taskRepository.findByDueDateRange).toHaveBeenCalledWith(start, end);
      expect(result).toEqual([mockTask]);
    });
  });

  describe('updateTaskStatus', () => {
    it('should update status via repository', async () => {
      const updated = { ...mockTask, status: TaskStatus.DONE };
      taskRepository.updateStatus.mockResolvedValue(updated);

      const result = await taskService.updateTaskStatus('task-1', TaskStatus.DONE);

      expect(taskRepository.updateStatus).toHaveBeenCalledWith('task-1', TaskStatus.DONE);
      expect(result).toEqual(updated);
    });
  });
});