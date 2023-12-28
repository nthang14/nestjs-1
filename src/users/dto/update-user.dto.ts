import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';


export class UpdateUserDto {
    @IsNotEmpty()
    @MaxLength(128)
    fullName: string;
  
    @IsNotEmpty()
    @MaxLength(50)
    username: string;
    @IsOptional()
    password?: string;
    @IsOptional()
    phoneNumber?: string;
    @IsOptional()
    address?: string;
  }

