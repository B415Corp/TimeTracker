import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { BlockType } from '../../../common/enums/block-type.enum';

export class CreateBlockDto {
  @ApiProperty({ enum: BlockType, description: 'Type of the block' })
  @IsEnum(BlockType)
  type: BlockType;

  @ApiProperty({ description: 'Content of the block (JSON structure)' })
  content: any;

  @ApiProperty({ description: 'Order/position of the block', required: false })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({ description: 'Parent block ID for nesting', required: false })
  @IsOptional()
  @IsString()
  parent_block_id?: string;

  @ApiProperty({ description: 'Block properties/metadata (JSON)', required: false })
  @IsOptional()
  properties?: any;
}
