import { IsNotEmpty, MaxLength } from 'class-validator';
export class BaseUserDTO {
  @IsNotEmpty()
  @MaxLength(128)
  fullName: string;

  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  password: string;
}
