import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class UpdateFieldDto {
  @ApiProperty({ description: 'Name of the field', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ description: 'Field configuration (JSON)', required: false })
  @IsOptional()
  config?: any;

  @ApiProperty({ description: 'Is this field required', required: false })
  @IsOptional()
  @IsBoolean()
  is_required?: boolean;
}
