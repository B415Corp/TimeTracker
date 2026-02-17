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
import { CustomFieldsService } from './custom-fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { SetFieldValueDto } from './dto/set-field-value.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CustomField } from '../../entities/custom-field.entity';
import { DocumentFieldValue } from '../../entities/document-field-value.entity';

@ApiTags('custom-fields')
@Controller()
export class CustomFieldsController {
  constructor(private readonly fieldsService: CustomFieldsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: CustomField })
  @ApiOperation({ summary: 'Create a new field' })
  @Post('projects/:projectId/fields')
  create(
    @Param('projectId') projectId: string,
    @Body() createFieldDto: CreateFieldDto,
  ) {
    return this.fieldsService.create(projectId, createFieldDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: [CustomField] })
  @ApiOperation({ summary: 'Get all fields in a project' })
  @Get('projects/:projectId/fields')
  findAllByProject(@Param('projectId') projectId: string) {
    return this.fieldsService.findAllByProject(projectId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: CustomField })
  @ApiOperation({ summary: 'Update a field' })
  @Patch('fields/:fieldId')
  update(
    @Param('fieldId') fieldId: string,
    @Body() updateFieldDto: UpdateFieldDto,
  ) {
    return this.fieldsService.update(fieldId, updateFieldDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOperation({ summary: 'Delete a field' })
  @Delete('fields/:fieldId')
  remove(@Param('fieldId') fieldId: string) {
    return this.fieldsService.remove(fieldId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: DocumentFieldValue })
  @ApiOperation({ summary: 'Set field value for a document' })
  @Post('documents/:documentId/fields/:fieldId/value')
  setFieldValue(
    @Param('documentId') documentId: string,
    @Param('fieldId') fieldId: string,
    @Body() setFieldValueDto: SetFieldValueDto,
  ) {
    return this.fieldsService.setFieldValue(documentId, fieldId, setFieldValueDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: [DocumentFieldValue] })
  @ApiOperation({ summary: 'Get all field values for a document' })
  @Get('documents/:documentId/fields')
  getDocumentFieldValues(@Param('documentId') documentId: string) {
    return this.fieldsService.getDocumentFieldValues(documentId);
  }
}
