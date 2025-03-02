import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get hello message',
    description: 'Returns a greeting message',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the hello message',
    type: String,
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
