import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateManualTimeLogDto {
  @ApiProperty({ description: 'Длительность логируемого времени в миллисекундах', example: 3600000 })
  @IsNumber()
  @IsPositive()
  duration: number; // в миллисекундах
} 