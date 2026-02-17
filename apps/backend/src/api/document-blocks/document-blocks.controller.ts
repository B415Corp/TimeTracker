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
import { DocumentBlocksService } from './document-blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { ReorderBlocksDto } from './dto/reorder-blocks.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DocumentBlock } from '../../entities/document-block.entity';
import { BlockType } from '../../common/enums/block-type.enum';

@ApiTags('document-blocks')
@Controller()
export class DocumentBlocksController {
  constructor(private readonly blocksService: DocumentBlocksService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: DocumentBlock })
  @ApiOperation({ summary: 'Create a new block in a document' })
  @Post('documents/:documentId/blocks')
  create(
    @Param('documentId') documentId: string,
    @Body() createBlockDto: CreateBlockDto,
  ) {
    return this.blocksService.create(documentId, createBlockDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: [DocumentBlock] })
  @ApiOperation({ summary: 'Get all blocks in a document' })
  @Get('documents/:documentId/blocks')
  findAllByDocument(@Param('documentId') documentId: string) {
    return this.blocksService.findAllByDocument(documentId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: DocumentBlock })
  @ApiOperation({ summary: 'Update a block' })
  @Patch('blocks/:blockId')
  update(
    @Param('blockId') blockId: string,
    @Body() updateBlockDto: UpdateBlockDto,
  ) {
    return this.blocksService.update(blockId, updateBlockDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOperation({ summary: 'Delete a block' })
  @Delete('blocks/:blockId')
  remove(@Param('blockId') blockId: string) {
    return this.blocksService.remove(blockId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: [DocumentBlock] })
  @ApiOperation({ summary: 'Reorder blocks in a document' })
  @Post('documents/:documentId/blocks/reorder')
  reorder(
    @Param('documentId') documentId: string,
    @Body() reorderBlocksDto: ReorderBlocksDto,
  ) {
    return this.blocksService.reorder(documentId, reorderBlocksDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: DocumentBlock })
  @ApiOperation({ summary: 'Convert block type' })
  @Post('blocks/:blockId/convert')
  convert(
    @Param('blockId') blockId: string,
    @Body('type') type: BlockType,
  ) {
    return this.blocksService.convert(blockId, type);
  }
}
