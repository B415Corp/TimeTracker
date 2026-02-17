import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateDocumentDto {
  @ApiProperty({ description: 'Title of the document', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({ description: 'Icon (emoji or URL)', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'Cover image URL', required: false })
  @IsOptional()
  @IsString()
  cover_image?: string;
}
