import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsNumber, Min, Max } from "class-validator";

export class UpdateNotesDto {
  @ApiProperty({ description: 'Text-content of note' })
  @IsOptional()
  @IsString()
  text_content?: string;

  @ApiProperty({ 
    description: 'Parent note ID for nested notes',
    required: false 
  })
  @IsOptional()
  @IsUUID()
  parent_note_id?: string;

  @ApiProperty({ 
    description: 'Task ID if note is linked to a task',
    required: false 
  })
  @IsOptional()
  @IsUUID()
  task_id?: string;

  @ApiProperty({ 
    description: 'Nesting level (0-10 allowed)',
    required: false,
    minimum: 0,
    maximum: 10
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  nesting_level?: number;

  @ApiProperty({ 
    description: 'Порядок строки внутри родителя',
    required: false
  })
  @IsOptional()
  order?: number;
}
