import { IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsBoolean({ message: 'Completed must be a boolean' })
  completed: boolean;
}
