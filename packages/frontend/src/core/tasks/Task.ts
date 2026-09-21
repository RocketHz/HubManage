export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}
