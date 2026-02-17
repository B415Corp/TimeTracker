import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DocumentCommentsService } from './document-comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ReplyCommentDto } from './dto/reply-comment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../../entities/user.entity';
import { DocumentComment } from '../../entities/document-comment.entity';

@ApiTags('document-comments')
@Controller()
export class DocumentCommentsController {
  constructor(private readonly commentsService: DocumentCommentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: DocumentComment })
  @ApiOperation({ summary: 'Create a comment on a document' })
  @Post('documents/:documentId/comments')
  createDocumentComment(
    @Param('documentId') documentId: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.createDocumentComment(
      documentId,
      createCommentDto,
      user.user_id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: DocumentComment })
  @ApiOperation({ summary: 'Create a comment on a block' })
  @Post('blocks/:blockId/comments')
  createBlockComment(
    @Param('blockId') blockId: string,
    @Body('content') content: string,
    @GetUser() user: User,
  ) {
    return this.commentsService.createBlockComment(blockId, content, user.user_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: [DocumentComment] })
  @ApiOperation({ summary: 'Get all comments for a document' })
  @Get('documents/:documentId/comments')
  findAllByDocument(@Param('documentId') documentId: string) {
    return this.commentsService.findAllByDocument(documentId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: DocumentComment })
  @ApiOperation({ summary: 'Update a comment' })
  @Patch('comments/:commentId')
  update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(commentId, updateCommentDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOperation({ summary: 'Delete a comment' })
  @Delete('comments/:commentId')
  remove(@Param('commentId') commentId: string) {
    return this.commentsService.remove(commentId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: DocumentComment })
  @ApiOperation({ summary: 'Reply to a comment' })
  @Post('comments/:commentId/replies')
  replyToComment(
    @Param('commentId') commentId: string,
    @Body() replyCommentDto: ReplyCommentDto,
    @GetUser() user: User,
  ) {
    return this.commentsService.replyToComment(
      commentId,
      replyCommentDto,
      user.user_id,
    );
  }
}
