import {
  Controller,
  Get,
  Param,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DocumentVersionsService } from './document-versions.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DocumentVersion } from '../../entities/document-version.entity';

@ApiTags('document-versions')
@Controller()
export class DocumentVersionsController {
  constructor(private readonly versionsService: DocumentVersionsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: [DocumentVersion] })
  @ApiOperation({ summary: 'Get version history for a document' })
  @Get('documents/:documentId/versions')
  findAllByDocument(@Param('documentId') documentId: string) {
    return this.versionsService.findAllByDocument(documentId);
  }
}
