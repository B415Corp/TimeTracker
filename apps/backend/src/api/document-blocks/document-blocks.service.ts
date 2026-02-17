import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentBlock } from '../../entities/document-block.entity';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { ReorderBlocksDto } from './dto/reorder-blocks.dto';

@Injectable()
export class DocumentBlocksService {
  constructor(
    @InjectRepository(DocumentBlock)
    private blocksRepository: Repository<DocumentBlock>,
  ) {}

  async create(
    documentId: string,
    createBlockDto: CreateBlockDto,
  ): Promise<DocumentBlock> {
    // If order is not provided, set it to be last
    if (createBlockDto.order === undefined) {
      const lastBlock = await this.blocksRepository.findOne({
        where: { document_id: documentId },
        order: { order: 'DESC' },
      });
      createBlockDto.order = lastBlock ? lastBlock.order + 1 : 0;
    }

    const block = this.blocksRepository.create({
      ...createBlockDto,
      document_id: documentId,
    });

    return this.blocksRepository.save(block);
  }

  async findAllByDocument(documentId: string): Promise<DocumentBlock[]> {
    return this.blocksRepository.find({
      where: { document_id: documentId },
      order: { order: 'ASC' },
      relations: ['children'],
    });
  }

  async findOne(blockId: string): Promise<DocumentBlock> {
    const block = await this.blocksRepository.findOne({
      where: { block_id: blockId },
      relations: ['document', 'parent', 'children'],
    });

    if (!block) {
      throw new NotFoundException(`Block with ID ${blockId} not found`);
    }

    return block;
  }

  async update(
    blockId: string,
    updateBlockDto: UpdateBlockDto,
  ): Promise<DocumentBlock> {
    const block = await this.findOne(blockId);

    Object.assign(block, updateBlockDto);

    return this.blocksRepository.save(block);
  }

  async remove(blockId: string): Promise<void> {
    const block = await this.findOne(blockId);
    await this.blocksRepository.remove(block);
  }

  async reorder(
    documentId: string,
    reorderBlocksDto: ReorderBlocksDto,
  ): Promise<DocumentBlock[]> {
    const blocks = await Promise.all(
      reorderBlocksDto.blocks.map(async ({ block_id, order }) => {
        const block = await this.blocksRepository.findOne({
          where: { block_id, document_id: documentId },
        });
        if (block) {
          block.order = order;
          return this.blocksRepository.save(block);
        }
        return null;
      }),
    );

    return blocks.filter((block) => block !== null);
  }

  async convert(blockId: string, newType: any): Promise<DocumentBlock> {
    const block = await this.findOne(blockId);
    block.type = newType;
    return this.blocksRepository.save(block);
  }
}
