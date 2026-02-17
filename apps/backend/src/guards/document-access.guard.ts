import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { DocumentMember } from '../entities/document-member.entity';
import { ProjectMember } from '../entities/project-shared.entity';
import { PROJECT_ROLE } from '../common/enums/project-role.enum';
import { DocumentRole } from '../common/enums/document-role.enum';

@Injectable()
export class DocumentAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(DocumentMember)
    private documentMembersRepository: Repository<DocumentMember>,
    @InjectRepository(ProjectMember)
    private projectMembersRepository: Repository<ProjectMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const documentId = request.params.documentId;

    if (!user || !documentId) {
      throw new ForbiddenException('Access denied');
    }

    const document = await this.documentsRepository.findOne({
      where: { document_id: documentId },
      relations: ['project'],
    });

    if (!document) {
      throw new ForbiddenException('Document not found');
    }

    // Check if user is project owner
    if (document.project.user_owner_id === user.user_id) {
      return true;
    }

    // Check if user is in project members
    const projectMember = await this.projectMembersRepository.findOne({
      where: {
        project_id: document.project_id,
        user_id: user.user_id,
      },
    });

    if (projectMember) {
      // Project MANAGER and OWNER have full access
      if (
        projectMember.role === PROJECT_ROLE.OWNER ||
        projectMember.role === PROJECT_ROLE.MANAGER
      ) {
        return true;
      }

      // Project EXECUTOR has read access by default (can be overridden by document members)
      if (projectMember.role === PROJECT_ROLE.EXECUTOR) {
        // Check for explicit document member role
        const documentMember = await this.documentMembersRepository.findOne({
          where: {
            document_id: documentId,
            user_id: user.user_id,
          },
        });

        // If explicit role is set, use it
        if (documentMember) {
          return this.checkDocumentRole(documentMember.role, request.method);
        }

        // Default read access for executors
        return request.method === 'GET';
      }
    }

    // Check if user is explicitly added as document member
    const documentMember = await this.documentMembersRepository.findOne({
      where: {
        document_id: documentId,
        user_id: user.user_id,
      },
    });

    if (documentMember) {
      return this.checkDocumentRole(documentMember.role, request.method);
    }

    throw new ForbiddenException('Access denied to this document');
  }

  private checkDocumentRole(role: DocumentRole, method: string): boolean {
    switch (role) {
      case DocumentRole.OWNER:
      case DocumentRole.EDITOR:
        return true; // Full access
      case DocumentRole.COMMENTER:
        // Can read and comment
        return method === 'GET' || method === 'POST';
      case DocumentRole.VIEWER:
        // Read-only access
        return method === 'GET';
      default:
        return false;
    }
  }
}
