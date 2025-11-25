import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('v1')
export class ServerController {
  @Get('/health')
  @HttpCode(HttpStatus.OK)
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
