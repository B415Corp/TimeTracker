import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the client' })
  readonly name: string;

  @ApiProperty({
    example: [{ type: 'phone', value: '+1234567890' }],
    description: 'Дополнительные опциональные поля клиента',
    required: false,
    isArray: true,
  })
  readonly additional_fields?: { type: string; value: string }[];
}
