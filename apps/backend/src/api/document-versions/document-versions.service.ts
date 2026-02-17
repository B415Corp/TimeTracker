import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentVersion } from '../../entities/document-version.entity';

@Injectable()
export class DocumentVersionsService {
  constructor(
    @InjectRepository(DocumentVersion)
    private versionsRepository: Repository<DocumentVersion>,
  ) {}

  async createVersion(
    documentId: string,
    userId: string,
    changeDescription?: string,
  ): Promise<DocumentVersion> {
    const version = this.versionsRepository.create({
      document_id: documentId,
      updated_by: userId,
      change_description: changeDescription,
    });

    return this.versionsRepository.save(version);
  }

  async findAllByDocument(documentId: string): Promise<DocumentVersion[]> {
    return this.versionsRepository.find({
      where: { document_id: documentId },
      relations: ['user'],
      order: { updated_at: 'DESC' },
    });
  }
}
