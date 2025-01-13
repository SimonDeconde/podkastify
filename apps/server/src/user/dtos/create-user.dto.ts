import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() //should not be empty
  @IsString() //should be a string
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  // @IsDateString({ strict: true }) //should be in format 2022-07-15.
  // dateOfBirth: Date;

  @IsEmail() //should be a valid email
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  status: string;
}
