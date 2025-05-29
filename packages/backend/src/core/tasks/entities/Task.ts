import { TaskStatus } from '../enums/task-status';

export class Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
  
  constructor(id: string, title: string, description: string, dueDate: Date, status: TaskStatus) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.status = status;
  }
}

