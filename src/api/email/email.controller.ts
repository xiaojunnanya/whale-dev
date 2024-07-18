import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './dto/email.dto'
import * as svgCaptcha from 'svg-captcha';

// 验证码可以添加限流处理
@Controller('sendEmail')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // 邮箱验证码
  @Post()
  sendEmail(@Body() info: EmailDto) {
    return this.emailService.sendMail(info.email, info.type);
  }

  // 图片验证码
  @Get('imgcode')
  sendImgCode(@Res() res, @Req() req) {
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 120, //宽度
      height: 44, //高度
      background: '#22B9F2', //背景颜色
    });
    req.session.imgcode = captcha.text; //存储验证码记录到session
    res.type('image/svg+xml');
    res.send(captcha.data);
  }
}
