import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Version(VERSION_NEUTRAL)
  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Version('1')
  @ApiOperation({ summary: 'Test endpoint for API structure verification' })
  @ApiResponse({ status: 200, description: 'Returns test message with version' })
  @Get('testGet')
  testGet(): { message: string; version: string; path: string } {
    return {
      message: 'Test endpoint is working!',
      version: 'v1',
      path: '/api/v1/testGet'
    };
  }
}
