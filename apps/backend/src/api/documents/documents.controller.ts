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
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { MoveDocumentDto } from './dto/move-document.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../../entities/user.entity';
import { Document } from '../../entities/document.entity';

@ApiTags('documents')
@Controller()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: Document })
  @ApiOperation({ summary: 'Create a new document' })
  @Post('projects/:projectId/documents')
  create(
    @Param('projectId') projectId: string,
    @Body() createDocumentDto: CreateDocumentDto,
    @GetUser() user: User,
  ) {
    return this.documentsService.create(projectId, createDocumentDto, user.user_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: [Document] })
  @ApiOperation({ summary: 'Get all documents in a project' })
  @Get('projects/:projectId/documents')
  findAllByProject(@Param('projectId') projectId: string) {
    return this.documentsService.findAllByProject(projectId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: [Document] })
  @ApiOperation({ summary: 'Get document hierarchy for a project' })
  @Get('projects/:projectId/documents/hierarchy')
  getHierarchy(@Param('projectId') projectId: string) {
    return this.documentsService.getHierarchy(projectId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: Document })
  @ApiOperation({ summary: 'Get a document by ID' })
  @Get('documents/:documentId')
  findOne(@Param('documentId') documentId: string) {
    return this.documentsService.findOne(documentId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: Document })
  @ApiOperation({ summary: 'Update a document' })
  @Patch('documents/:documentId')
  update(
    @Param('documentId') documentId: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @GetUser() user: User,
  ) {
    return this.documentsService.update(documentId, updateDocumentDto, user.user_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOperation({ summary: 'Delete a document' })
  @Delete('documents/:documentId')
  remove(@Param('documentId') documentId: string) {
    return this.documentsService.remove(documentId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: Document })
  @ApiOperation({ summary: 'Move document in hierarchy' })
  @Post('documents/:documentId/move')
  move(
    @Param('documentId') documentId: string,
    @Body() moveDocumentDto: MoveDocumentDto,
    @GetUser() user: User,
  ) {
    return this.documentsService.move(documentId, moveDocumentDto, user.user_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: Document })
  @ApiOperation({ summary: 'Get document tree (with children)' })
  @Get('documents/:documentId/tree')
  getTree(@Param('documentId') documentId: string) {
    return this.documentsService.getTree(documentId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOperation({ summary: 'Get document field values' })
  @Get('documents/:documentId/field-values')
  async getFieldValues(@Param('documentId') documentId: string) {
    const values = await this.documentsService.getFieldValues(documentId);
    return { success: true, data: values };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOperation({ summary: 'Set document field value' })
  @Post('documents/:documentId/field-values')
  async setFieldValue(
    @Param('documentId') documentId: string,
    @Body() body: { field_id: string; value: any },
  ) {
    const value = await this.documentsService.setFieldValue(
      documentId,
      body.field_id,
      body.value,
    );
    return { success: true, data: value };
  }
}
