import {
  Controller,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';

import { FileResponseDto } from './dto/file-response.dto';
import { FilesLocalService } from './files.service';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesLocalController {
  constructor(private readonly filesService: FilesLocalService) {}

  @ApiCreatedResponse({
    type: FileResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
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
          example: 'selfie',
          description: 'The type of the file (e.g., selfie, id_card)',
        },
        userId: {
          type: 'string',
          example: 'user-uuid',
          description: 'The ID of the user associated with the file',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { type: string; userId: string }, // Extract type and userId from the request body
  ): Promise<void> {
    const { type, userId } = body; // Destructure type and userId
    await this.filesService.create(file, type, userId); // Pass type and userId to the service
  }

  @Get(':path')
  @ApiExcludeEndpoint()
  download(@Param('path') path, @Response() response) {
    return response.sendFile(path, { root: './files' });
  }
}
