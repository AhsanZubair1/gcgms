import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FileUploadDto } from '@src/files/infrastructure/uploader/s3/dto/file-upload.dto';
import { FilesS3Service } from '@src/files/infrastructure/uploader/s3/files.service';

import { FileResponseDto } from './dto/file-response.dto';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
// @UseGuards(ApiKeyGuard)
export class FilesS3Controller {
  constructor(private readonly filesService: FilesS3Service) {}

  @ApiCreatedResponse({
    type: FileResponseDto,
  })
  @ApiBearerAuth()
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          example: 'PROFILE',
          description: 'PROFILE, ARTICLE, VIDEO',
        },
        assignUrl: {
          type: 'boolean',
          example: false,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.MulterS3.File,
    @Body() body: FileUploadDto,
  ): Promise<FileResponseDto> {
    const { type, assignUrl } = body;
    return this.filesService.create(file, type, assignUrl);
  }
}
