import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DocumentFilesService } from './document-files.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../../entities/user.entity';
import { DocumentFile } from '../../entities/document-file.entity';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@ApiTags('document-files')
@Controller()
export class DocumentFilesController {
  constructor(private readonly filesService: DocumentFilesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: DocumentFile })
  @ApiOperation({ summary: 'Upload a file to a document' })
  @Post('documents/:documentId/files')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const documentId = req.params.documentId;
          const uploadPath = join(process.cwd(), 'uploads', 'documents', documentId);
          
          // Create directory if it doesn't exist
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          cb(null, `${timestamp}-${file.originalname}`);
        },
      }),
    }),
  )
  uploadFile(
    @Param('documentId') documentId: string,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
    @Query('blockId') blockId?: string,
  ) {
    return this.filesService.uploadFile(documentId, file, user.user_id, blockId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: [DocumentFile] })
  @ApiOperation({ summary: 'Get all files in a document' })
  @Get('documents/:documentId/files')
  findAllByDocument(@Param('documentId') documentId: string) {
    return this.filesService.findAllByDocument(documentId);
  }

  @ApiBearerAuth()
  @Version('1')
  @ApiOperation({ summary: 'Download a file' })
  @Get('files/:fileId')
  async downloadFile(@Param('fileId') fileId: string, @Res() res) {
    const file = await this.filesService.findOne(fileId);
    const filepath = join(process.cwd(), 'uploads', file.path);
    return res.download(filepath, file.filename);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOperation({ summary: 'Delete a file' })
  @Delete('files/:fileId')
  async remove(@Param('fileId') fileId: string) {
    await this.filesService.remove(fileId);
    return { success: true };
  }
}
