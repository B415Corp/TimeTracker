import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { BlockType } from '../../../common/enums/block-type.enum';

export class UpdateBlockDto {
  @ApiProperty({ enum: BlockType, description: 'Type of the block', required: false })
  @IsOptional()
  @IsEnum(BlockType)
  type?: BlockType;

  @ApiProperty({ description: 'Content of the block (JSON structure)', required: false })
  @IsOptional()
  content?: any;

  @ApiProperty({ description: 'Block properties/metadata (JSON)', required: false })
  @IsOptional()
  properties?: any;
}
