import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class MoveDocumentDto {
  @ApiProperty({ description: 'New parent document ID (null for root level)', required: false })
  @IsOptional()
  @IsString()
  parent_document_id?: string | null;
}
