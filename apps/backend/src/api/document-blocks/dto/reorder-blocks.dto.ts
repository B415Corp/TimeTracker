import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNumber } from 'class-validator';

class BlockOrderDto {
  @IsString()
  block_id: string;

  @IsNumber()
  order: number;
}

export class ReorderBlocksDto {
  @ApiProperty({ description: 'Array of block IDs with their new order', type: [BlockOrderDto] })
  @IsArray()
  blocks: BlockOrderDto[];
}
