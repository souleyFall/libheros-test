import { IsString, IsOptional, IsDateString, IsNotEmpty, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Short description is required' })
  @IsString({ message: 'Short description must be a string' })
  @MinLength(1, { message: 'Short description must be at least 1 character' })
  @MaxLength(255, { message: 'Short description must not exceed 255 characters' })
  shortDescription: string;

  @IsOptional()
  @IsString({ message: 'Long description must be a string' })
  longDescription?: string;

  @IsNotEmpty({ message: 'Due date is required' })
  @IsDateString({}, { message: 'Due date must be a valid date string' })
  dueDate: string;

  @IsNotEmpty({ message: 'List ID is required' })
  @IsNumber({}, { message: 'List ID must be a number' })
  listId: number;
}
