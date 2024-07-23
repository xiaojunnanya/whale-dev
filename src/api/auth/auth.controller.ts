import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto/auth.dto'
import * as svgCaptcha from 'svg-captcha';
import { BaseResponse } from '@/common/baseResponse';

// 验证码可以添加限流处理
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  response = new BaseResponse()

  // 邮箱验证码
  @Post('emailcode')
  sendEmail(@Body() info: EmailDto) {
    return this.authService.sendMail(info.email, info.type);
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

  checkCodeFun( imgcode: string, code: string ){
    if( imgcode && imgcode.toLowerCase() === code.toLowerCase() ){
      return true
    }
    return false
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req) {
    const { imgcode } = req.session
    // 验证码正确
    if(this.checkCodeFun(imgcode, loginDto.checkCode)){
      return this.authService.login(loginDto)
    }else{
      return this.response.baseResponse(1400, '验证码错误')
    }

  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Req() req) {
    const { imgcode } = req.session
    // 验证码正确
    if(this.checkCodeFun(imgcode, registerDto.checkCode)){
      return this.authService.register(registerDto);
    }else{
      return this.response.baseResponse(1400, '验证码错误')
    }
  }

  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Req() req) {
    const { imgcode } = req.session
    // 验证码正确
    if(this.checkCodeFun(imgcode, resetPasswordDto.checkCode)){
      return this.authService.resetPassword(resetPasswordDto);
    }else{
      return this.response.baseResponse(1400, '验证码错误')
    }
  }
}
