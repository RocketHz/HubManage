import { IsString, IsNotEmpty, IsDate, IsEnum, MaxLength, IsOptional } from 'class-validator';
import { TaskStatus } from '../../../core/tasks/enums/task-status';
import { Type } from 'class-transformer';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDate?: Date;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
