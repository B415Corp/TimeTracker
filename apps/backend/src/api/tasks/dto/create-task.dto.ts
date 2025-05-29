import { ApiProperty } from '@nestjs/swagger';
import { popularCurrencies } from 'src/common/constants';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Task name', description: 'Task name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'project-uuid', description: 'Project ID' })
  @IsUUID()
  project_id: string;

  @ApiProperty()
  is_paid: boolean;

  @ApiProperty({
    enum: ['fixed', 'hourly'],
    example: 'hourly',
  })
  payment_type: 'fixed' | 'hourly';

  @ApiProperty({ example: 10 })
  rate: number;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty({ example: popularCurrencies[0].code })
  currency_id: string;

  @ApiProperty({
    example: ['tag1', 'tag2'],
  })
  tag_ids?: string[];

  @ApiProperty({
    description: 'ID статуса задачи (TaskStatus)',
    example: 'b1234567-89ab-cdef-0123-456789abcdef',
    required: true,
  })
  task_status_id: string;
}
