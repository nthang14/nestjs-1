import { IsNotEmpty, IsOptional } from 'class-validator';
export class BaseFileDTO {
  @IsNotEmpty()
  ggId: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  fileExtension: string;

  @IsNotEmpty()
  webContentLink: string;

  @IsNotEmpty()
  fileSize: number;

  @IsNotEmpty()
  thumbnailLink: string;

  @IsNotEmpty()
  iconLink: string;

  @IsOptional()
  sharedIds?: string[];

  @IsNotEmpty()
  ownerId?: string;

  @IsOptional()
  parentId?: string;
}
