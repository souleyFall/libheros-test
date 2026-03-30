import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit faire minimum 6 caractères' })
  @MaxLength(50)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, { message: 'mot de passe trop faible' })
  password: string;
}