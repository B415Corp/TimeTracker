import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { DocumentRole } from '../../../common/enums/document-role.enum';

export class UpdateMemberDto {
  @ApiProperty({ enum: DocumentRole, description: 'New role of the member' })
  @IsEnum(DocumentRole)
  role: DocumentRole;
}
