import { ApiProperty } from '@nestjs/swagger';
import { popularCurrencies } from 'src/common/constants';

export class UpdateTaskDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  is_paid?: boolean;

  @ApiProperty({
    enum: ['fixed', 'hourly'],
    example: 'hourly',
    required: false,
  })
  payment_type?: 'fixed' | 'hourly';

  @ApiProperty({ required: false })
  rate?: number;

  @ApiProperty({ required: false })
  order?: number;

  @ApiProperty({ example: popularCurrencies[0].code, required: false })
  currency_id?: string;

  @ApiProperty({
    description: 'ID статуса задачи (TaskStatus)',
    example: 'b1234567-89ab-cdef-0123-456789abcdef',
    required: false,
  })
  task_status_id?: string;

  @ApiProperty({ type: String, format: 'date-time', required: false, description: 'Дата начала выполнения задачи (ISO)' })
  start_date?: string;

  @ApiProperty({ type: String, format: 'date-time', required: false, description: 'Крайний срок выполнения задачи (ISO)' })
  end_date?: string;
}
