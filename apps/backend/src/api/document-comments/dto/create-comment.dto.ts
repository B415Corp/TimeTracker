import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Comment content' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Block ID (for block-level comments)', required: false })
  @IsOptional()
  @IsString()
  block_id?: string;
}
