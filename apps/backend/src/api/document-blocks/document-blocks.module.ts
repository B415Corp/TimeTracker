import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBlocksService } from './document-blocks.service';
import { DocumentBlocksController } from './document-blocks.controller';
import { DocumentBlock } from '../../entities/document-block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentBlock])],
  controllers: [DocumentBlocksController],
  providers: [DocumentBlocksService],
  exports: [DocumentBlocksService],
})
export class DocumentBlocksModule {}
