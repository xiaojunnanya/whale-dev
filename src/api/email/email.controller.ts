import { Body, Controller, Post, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './dto/email.dto'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  sendEmail(@Body() info: EmailDto) {
    return this.emailService.sendMail(info.address, info.type);
  }
}
