import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { LarkEncryptVerificationRequestDto } from './dto/verification-request.dto';

@Controller('lark')
export class AppController {
  constructor(private readonly larkService: AppService) {}

  @Post('webhook-event')
  async webhookEvent(@Body() request: LarkEncryptVerificationRequestDto) {
    return this.larkService.eventWebhook(request);
  }
}
