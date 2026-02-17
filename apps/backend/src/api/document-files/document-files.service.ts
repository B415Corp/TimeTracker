import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentFile } from '../../entities/document-file.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentFilesService {
  constructor(
    @InjectRepository(DocumentFile)
    private filesRepository: Repository<DocumentFile>,
  ) {}

  async uploadFile(
    documentId: string,
    file: Express.Multer.File,
    userId: string,
    blockId?: string,
  ): Promise<DocumentFile> {
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;
    const relativePath = `documents/${documentId}/${filename}`;

    const documentFile = this.filesRepository.create({
      document_id: documentId,
      block_id: blockId,
      filename: file.originalname,
      path: relativePath,
      mime_type: file.mimetype,
      size: file.size,
      uploaded_by: userId,
    });

    return this.filesRepository.save(documentFile);
  }

  async findAllByDocument(documentId: string): Promise<DocumentFile[]> {
    return this.filesRepository.find({
      where: { document_id: documentId },
      relations: ['uploader'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(fileId: string): Promise<DocumentFile> {
    const file = await this.filesRepository.findOne({
      where: { file_id: fileId },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    return file;
  }

  async remove(fileId: string): Promise<void> {
    const file = await this.findOne(fileId);

    // Delete physical file
    const fullPath = path.join(process.cwd(), 'uploads', file.path);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await this.filesRepository.remove(file);
  }
}
