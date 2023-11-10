// import { getDriveService } from '~/file/providers/google-drive.provider';
import { Injectable } from '@nestjs/common';
// import toStream = require('buffer-to-stream');
import { google } from 'googleapis';
import * as path from 'path';
import { Readable } from 'stream';

@Injectable()
export class GoogleDriveService {
  async getAuth() {
    const KEYFILEPATH = path.join(
      __dirname,
      '/../../src/file/config/config.google-drive.json',
    );
    const SCOPES = ['https://www.googleapis.com/auth/drive'];
    const auth = await new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES,
    });
    return auth;
  }

  bufferToStream(buffer: Buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  async uploadFile(file: any) {
    const auth = await this.getAuth();
    const driveService = google.drive({ version: 'v2', auth });

    const metadata = {
      title: file.originalname,
      parents: [{ id: '1y_iL5EegZ8B_IHASqHCsPd3_xvQz4JKD' }],
    };
    const media = {
      mimeType: file.mimetype,
      body: this.bufferToStream(file.buffer),
    };
    const result = await driveService.files.insert({
      requestBody: metadata,
      media: media,
      fields:
        'id, fileExtension, title, webContentLink, fileSize, thumbnailLink, iconLink',
    });
    await driveService.permissions.insert({
      fileId: result.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    return result.data;
  }

  async getTokenGG() {
    const auth = await this.getAuth();
    const driveService = google.drive({ version: 'v2', auth });
    const download = await driveService.files.list();
    const token = download.config.headers.Authorization.split(' ')[1];
    if (token) return token;
    return '';
  }
}
