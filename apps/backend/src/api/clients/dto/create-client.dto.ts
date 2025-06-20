import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the client' })
  readonly name: string;

  @ApiProperty({
    example: [{ type: 'email', value: 'example@example.com' }],
    description: 'Дополнительные опциональные поля клиента (до 50)',
    required: false,
    isArray: true,
  })
  readonly additional_fields?: { type: string; value: string }[];

  @ApiProperty({
    example: '["tag1", "tag2"]',
    description: 'The IDs of the tags associated with the client',
  })
  readonly tag_ids?: string[];
}
