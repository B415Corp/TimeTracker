import { ApiProperty } from '@nestjs/swagger';

export class SetFieldValueDto {
  @ApiProperty({ description: 'Field value (JSON structure depends on field type)' })
  value: any;
}
