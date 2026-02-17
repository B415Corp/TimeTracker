import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Title of the document' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Parent document ID for hierarchy', required: false })
  @IsOptional()
  @IsString()
  parent_document_id?: string;

  @ApiProperty({ description: 'Icon (emoji or URL)', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'Cover image URL', required: false })
  @IsOptional()
  @IsString()
  cover_image?: string;
}
