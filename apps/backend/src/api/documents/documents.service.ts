import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../../entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { MoveDocumentDto } from './dto/move-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async create(
    projectId: string,
    createDocumentDto: CreateDocumentDto,
    userId: string,
  ): Promise<Document> {
    const document = this.documentsRepository.create({
      ...createDocumentDto,
      project_id: projectId,
      created_by: userId,
      updated_by: userId,
    });

    return this.documentsRepository.save(document);
  }

  async findAllByProject(projectId: string): Promise<Document[]> {
    return this.documentsRepository.find({
      where: { project_id: projectId },
      relations: ['creator', 'updater', 'parent', 'children'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(documentId: string): Promise<Document> {
    const document = await this.documentsRepository.findOne({
      where: { document_id: documentId },
      relations: ['creator', 'updater', 'parent', 'children', 'members', 'members.user'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    return document;
  }

  async update(
    documentId: string,
    updateDocumentDto: UpdateDocumentDto,
    userId: string,
  ): Promise<Document> {
    const document = await this.findOne(documentId);

    Object.assign(document, updateDocumentDto);
    document.updated_by = userId;

    return this.documentsRepository.save(document);
  }

  async remove(documentId: string): Promise<void> {
    const document = await this.findOne(documentId);
    await this.documentsRepository.remove(document);
  }

  async move(
    documentId: string,
    moveDocumentDto: MoveDocumentDto,
    userId: string,
  ): Promise<Document> {
    const document = await this.findOne(documentId);

    // Check for circular reference
    if (moveDocumentDto.parent_document_id) {
      const isCircular = await this.checkCircularReference(
        documentId,
        moveDocumentDto.parent_document_id,
      );
      if (isCircular) {
        throw new ForbiddenException('Circular reference detected');
      }
    }

    document.parent_document_id = moveDocumentDto.parent_document_id || null;
    document.updated_by = userId;

    return this.documentsRepository.save(document);
  }

  async getTree(documentId: string): Promise<Document> {
    const document = await this.documentsRepository.findOne({
      where: { document_id: documentId },
      relations: ['children', 'children.children'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    return document;
  }

  private async checkCircularReference(
    documentId: string,
    targetParentId: string,
  ): Promise<boolean> {
    if (documentId === targetParentId) {
      return true;
    }

    const parent = await this.documentsRepository.findOne({
      where: { document_id: targetParentId },
    });

    if (!parent || !parent.parent_document_id) {
      return false;
    }

    return this.checkCircularReference(documentId, parent.parent_document_id);
  }
}
