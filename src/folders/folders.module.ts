import { Module } from '@nestjs/common';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { JwtStrategy } from '~/auth/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Folder, FolderSchema } from '~/folders/schemas/folders.schema';
import { FileModule } from '~/file/file.module';
@Module({
  imports: [
    FileModule,
    MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }]),
  ],
  controllers: [FoldersController],
  providers: [FoldersService, JwtStrategy],
})
export class FoldersModule {}
