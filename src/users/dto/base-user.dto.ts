import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
export class BaseUserDTO {
  @IsNotEmpty()
  @MaxLength(128)
  fullName: string;

  @IsNotEmpty()
  @MaxLength(50)
  username: string;
  @IsNotEmpty()
  password: string;
  @IsOptional()
  phoneNumber?: string;
  @IsOptional()
  address?: string;
}
