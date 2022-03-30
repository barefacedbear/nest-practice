import { Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
// import { extname } from 'path';
import { editFileName } from 'util/file.util';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './upload',
      filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0];
        const fileExtName = extname(file.originalname);
        callback(null, `${name}-${new Date().getTime()}${fileExtName}`);
      }
    })
  }))
  uploadFile(@UploadedFile() file) {
    console.log(file)
  }
}
