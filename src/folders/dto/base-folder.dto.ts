import { IsNotEmpty, IsOptional } from 'class-validator';

export class BaseFolderDTO {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  ownerId?: string;

  @IsOptional()
  sharedIds?: string[];

  @IsOptional()
  parentId?: string;
}
