import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { DocumentRole } from '../../../common/enums/document-role.enum';

export class AddMemberDto {
  @ApiProperty({ description: 'User ID to add as member' })
  @IsString()
  user_id: string;

  @ApiProperty({ enum: DocumentRole, description: 'Role of the member' })
  @IsEnum(DocumentRole)
  role: DocumentRole;
}
