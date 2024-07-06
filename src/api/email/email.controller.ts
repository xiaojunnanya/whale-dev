import { Body, Controller, Post, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './dto/email.dto'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  sendEmail(@Body() info: EmailDto) {
    // 这边还有请求参数来判断是否正确，目前只是安装了class-validator
    return this.emailService.sendMail(info.address, info.type);
  }
}
