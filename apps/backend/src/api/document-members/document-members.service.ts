import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentMember } from '../../entities/document-member.entity';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class DocumentMembersService {
  constructor(
    @InjectRepository(DocumentMember)
    private membersRepository: Repository<DocumentMember>,
  ) {}

  async addMember(
    documentId: string,
    addMemberDto: AddMemberDto,
    assignedBy: string,
  ): Promise<DocumentMember> {
    // Check if member already exists
    const existing = await this.membersRepository.findOne({
      where: {
        document_id: documentId,
        user_id: addMemberDto.user_id,
      },
    });

    if (existing) {
      throw new ConflictException('User is already a member of this document');
    }

    const member = this.membersRepository.create({
      document_id: documentId,
      user_id: addMemberDto.user_id,
      role: addMemberDto.role,
      assigned_by: assignedBy,
    });

    return this.membersRepository.save(member);
  }

  async findAllByDocument(documentId: string): Promise<DocumentMember[]> {
    return this.membersRepository.find({
      where: { document_id: documentId },
      relations: ['user', 'assigner'],
    });
  }

  async updateMemberRole(
    memberId: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<DocumentMember> {
    const member = await this.membersRepository.findOne({
      where: { member_id: memberId },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    member.role = updateMemberDto.role;

    return this.membersRepository.save(member);
  }

  async removeMember(memberId: string): Promise<void> {
    const member = await this.membersRepository.findOne({
      where: { member_id: memberId },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    await this.membersRepository.remove(member);
  }

  async checkAccess(documentId: string, userId: string): Promise<any> {
    const member = await this.membersRepository.findOne({
      where: {
        document_id: documentId,
        user_id: userId,
      },
    });

    return {
      hasAccess: !!member,
      role: member?.role || null,
    };
  }
}
