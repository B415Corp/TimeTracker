import { Controller, Post, Get, Delete, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { File } from 'multer';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FileDto } from './dto/file.dto';
import { UploadFileDto } from './dto/file.dto';

@ApiBearerAuth()
@ApiTags('Notes Files')
@Controller('notes/:noteId/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ 
    summary: 'Загрузить файл к заметке',
    description: 'Максимальный размер файла: 25MB. Разрешенные типы: PDF, DOC, DOCX, PNG, JPG' 
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Файл для загрузки',
    type: UploadFileDto,
  })
  @ApiParam({ name: 'noteId', description: 'ID заметки' })
  @ApiResponse({ 
    status: 201, 
    type: FileDto, 
    description: 'Файл успешно загружен' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Неверный формат файла или превышен размер' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Заметка не найдена' 
  })
  uploadFile(@Param('noteId') noteId: string, @UploadedFile() file: File) {
    return this.fileService.uploadFile(noteId, file);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Получить все файлы заметки',
    description: 'Возвращает список всех файлов, прикрепленных к заметке' 
  })
  @ApiParam({ name: 'noteId', description: 'ID заметки' })
  @ApiResponse({ 
    status: 200, 
    type: [FileDto], 
    description: 'Список файлов' 
  })
  getFiles(@Param('noteId') noteId: string) {
    return this.fileService.getFiles(noteId);
  }

  @Delete(':fileId')
  @ApiOperation({ 
    summary: 'Удалить файл заметки',
    description: 'Удаляет файл и его содержимое из системы' 
  })
  @ApiParam({ name: 'noteId', description: 'ID заметки' })
  @ApiParam({ name: 'fileId', description: 'ID файла' })
  @ApiResponse({ 
    status: 200, 
    description: 'Файл успешно удален' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Файл не найден' 
  })
  deleteFile(@Param('fileId') fileId: string) {
    return this.fileService.deleteFile(fileId);
  }
} 