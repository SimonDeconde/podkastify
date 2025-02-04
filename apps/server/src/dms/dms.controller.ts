import { Controller, Delete, Get, Param } from '@nestjs/common';
import { DmsService } from './dms.service';

@Controller('dms')
export class DmsController {
  constructor(private readonly dmsService: DmsService) {}

  //   @Post('/file')
  //   @UseInterceptors(FileInterceptor('file'))
  //   async uploadFile(
  //     @UploadedFile(
  //       new ParseFilePipe({
  //         validators: [
  //           new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
  //           new MaxFileSizeValidator({
  //             maxSize: 1024 * 1024 * 10, // 10MB
  //             message: 'File is too large. Max file size is 10MB',
  //           }),
  //         ],
  //         fileIsRequired: true,
  //       }),
  //     )
  //     file: Express.Multer.File,
  //     @Body('isPublic') isPublic: string,
  //   ) {
  //     const isPublicBool = isPublic === 'true' ? true : false;
  //     return this.dmsService.uploadSingleFile({ file, isPublic: isPublicBool });
  //   }

  @Get(':key')
  async getFileUrl(@Param('key') key: string) {
    return this.dmsService.getFileUrl(key);
  }

  @Get('/signed-url/:key')
  async getSingedUrl(@Param('key') key: string) {
    return this.dmsService.getPresignedSignedUrl(key);
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    return this.dmsService.deleteFile(key);
  }
}
