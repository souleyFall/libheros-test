import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateListDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(1, { message: 'Title must be at least 1 character' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title: string;
}