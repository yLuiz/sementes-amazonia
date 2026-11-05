import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth(@Res({ passthrough: true }) response: Response) {
    if (await this.appService.isDatabaseUp()) {
      return { status: 'ok', database: 'up' };
    }

    response.status(HttpStatus.SERVICE_UNAVAILABLE);
    return { status: 'error', database: 'down' };
  }
}
