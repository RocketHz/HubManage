import { IsString, IsNotEmpty, IsDate, IsEnum, MaxLength } from 'class-validator';
import { TaskStatus } from '../../../core/tasks/enums/task-status';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string = '';

  @IsString()
  @MaxLength(500)
  description: string = '';

  @IsDate()
  @Type(() => Date)
  dueDate: Date = new Date();

  @IsEnum(TaskStatus)
  status: TaskStatus = TaskStatus.TODO;
}

