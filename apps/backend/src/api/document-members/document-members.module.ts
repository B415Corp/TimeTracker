import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentMembersService } from './document-members.service';
import { DocumentMembersController } from './document-members.controller';
import { DocumentMember } from '../../entities/document-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentMember])],
  controllers: [DocumentMembersController],
  providers: [DocumentMembersService],
  exports: [DocumentMembersService],
})
export class DocumentMembersModule {}
