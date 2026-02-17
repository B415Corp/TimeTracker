import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentComment } from '../../entities/document-comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ReplyCommentDto } from './dto/reply-comment.dto';

@Injectable()
export class DocumentCommentsService {
  constructor(
    @InjectRepository(DocumentComment)
    private commentsRepository: Repository<DocumentComment>,
  ) {}

  async createDocumentComment(
    documentId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<DocumentComment> {
    const comment = this.commentsRepository.create({
      document_id: documentId,
      block_id: createCommentDto.block_id,
      content: createCommentDto.content,
      user_id: userId,
    });

    return this.commentsRepository.save(comment);
  }

  async createBlockComment(
    blockId: string,
    content: string,
    userId: string,
  ): Promise<DocumentComment> {
    const comment = this.commentsRepository.create({
      block_id: blockId,
      content,
      user_id: userId,
    });

    return this.commentsRepository.save(comment);
  }

  async findAllByDocument(documentId: string): Promise<DocumentComment[]> {
    return this.commentsRepository.find({
      where: { document_id: documentId },
      relations: ['user', 'replies', 'replies.user'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(commentId: string): Promise<DocumentComment> {
    const comment = await this.commentsRepository.findOne({
      where: { comment_id: commentId },
      relations: ['user', 'replies', 'replies.user'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    return comment;
  }

  async update(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<DocumentComment> {
    const comment = await this.findOne(commentId);

    comment.content = updateCommentDto.content;

    return this.commentsRepository.save(comment);
  }

  async remove(commentId: string): Promise<void> {
    const comment = await this.findOne(commentId);
    await this.commentsRepository.remove(comment);
  }

  async replyToComment(
    commentId: string,
    replyCommentDto: ReplyCommentDto,
    userId: string,
  ): Promise<DocumentComment> {
    const parentComment = await this.findOne(commentId);

    const reply = this.commentsRepository.create({
      parent_comment_id: commentId,
      document_id: parentComment.document_id,
      block_id: parentComment.block_id,
      content: replyCommentDto.content,
      user_id: userId,
    });

    return this.commentsRepository.save(reply);
  }
}
