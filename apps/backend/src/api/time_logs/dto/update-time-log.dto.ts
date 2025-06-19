import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateTimeLogDto {
  @ApiPropertyOptional({ description: 'Время начала', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  start_time?: string;

  @ApiPropertyOptional({ description: 'Время окончания', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  end_time?: string;

  @ApiPropertyOptional({ description: 'Длительность в миллисекундах' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;
} 