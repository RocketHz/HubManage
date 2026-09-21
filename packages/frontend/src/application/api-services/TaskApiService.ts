import axios from 'axios';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskStatus } from '../../core/tasks/Task';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export class TaskApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
    };
  }

  async getAllTasks(): Promise<Task[]> {
    const response = await axios.get<Task[]>(`${API_URL}/tasks`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await axios.get<Task>(`${API_URL}/tasks/${id}`, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async createTask(task: CreateTaskDTO): Promise<Task> {
    const response = await axios.post<Task>(`${API_URL}/tasks`, task, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateTask(id: string, task: UpdateTaskDTO): Promise<Task> {
    const response = await axios.put<Task>(`${API_URL}/tasks/${id}`, task, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const response = await axios.patch<Task>(`${API_URL}/tasks/${id}/status`, { status }, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await axios.delete(`${API_URL}/tasks/${id}`, {
      headers: this.getHeaders()
    });
  }
}

export const taskApiService = new TaskApiService();
