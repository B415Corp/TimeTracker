import { ApiProperty } from '@nestjs/swagger';
import { popularCurrencies } from 'src/common/constants';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Task name', description: 'Task name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  is_paid: boolean;

  @ApiProperty({
    enum: ['fixed', 'hourly'],
    example: 'hourly',
  })дуф
  payment_type: 'fixed' | 'hourly';

  @ApiProperty()
  rate: number;

  @ApiProperty()
  order: number;

  @ApiProperty({ example: popularCurrencies[0].code })
  currency_id: string;

  @ApiProperty({
    description: 'ID статуса задачи (TaskStatus)',
    example: 'b1234567-89ab-cdef-0123-456789abcdef',
    required: false,
  })
  task_status_id?: string;
}
