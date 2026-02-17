import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { FieldType } from '../../../common/enums/field-type.enum';

export class CreateFieldDto {
  @ApiProperty({ description: 'Name of the field' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ enum: FieldType, description: 'Type of the field' })
  @IsEnum(FieldType)
  type: FieldType;

  @ApiProperty({ description: 'Field configuration (JSON)', required: false })
  @IsOptional()
  config?: any;

  @ApiProperty({ description: 'Is this field required', required: false })
  @IsOptional()
  @IsBoolean()
  is_required?: boolean;
}
