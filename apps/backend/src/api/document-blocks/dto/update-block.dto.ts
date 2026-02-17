import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber, IsString } from 'class-validator';
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

  @ApiProperty({ description: 'Parent block ID for nesting', required: false })
  @IsOptional()
  @IsString()
  parent_block_id?: string | null;

  @ApiProperty({ description: 'Order/position of the block', required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}
