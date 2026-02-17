import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DocumentMembersService } from './document-members.service';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../../entities/user.entity';
import { DocumentMember } from '../../entities/document-member.entity';

@ApiTags('document-members')
@Controller()
export class DocumentMembersController {
  constructor(private readonly membersService: DocumentMembersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: DocumentMember })
  @ApiOperation({ summary: 'Add a member to a document' })
  @Post('documents/:documentId/members')
  addMember(
    @Param('documentId') documentId: string,
    @Body() addMemberDto: AddMemberDto,
    @GetUser() user: User,
  ) {
    return this.membersService.addMember(documentId, addMemberDto, user.user_id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: [DocumentMember] })
  @ApiOperation({ summary: 'Get all members of a document' })
  @Get('documents/:documentId/members')
  findAllByDocument(@Param('documentId') documentId: string) {
    return this.membersService.findAllByDocument(documentId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOkResponse({ type: DocumentMember })
  @ApiOperation({ summary: 'Update member role' })
  @Patch('documents/:documentId/members/:memberId')
  updateMemberRole(
    @Param('memberId') memberId: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.membersService.updateMemberRole(memberId, updateMemberDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOperation({ summary: 'Remove a member from a document' })
  @Delete('documents/:documentId/members/:memberId')
  removeMember(@Param('memberId') memberId: string) {
    return this.membersService.removeMember(memberId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Version('1')
  @ApiOperation({ summary: 'Check current user access to a document' })
  @Get('documents/:documentId/access')
  checkAccess(
    @Param('documentId') documentId: string,
    @GetUser() user: User,
  ) {
    return this.membersService.checkAccess(documentId, user.user_id);
  }
}
