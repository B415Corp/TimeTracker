import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReplyCommentDto {
  @ApiProperty({ description: 'Reply content' })
  @IsString()
  content: string;
}
