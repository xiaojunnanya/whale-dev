import { Body, Controller, Post, Req } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto, RegisterDto, ResetPasswordDto } from './dto/login.dto';
import { BaseResponse } from '@/common/baseResponse';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  response = new BaseResponse()


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
      return this.loginService.login(loginDto)
    }else{
      return this.response.baseResponse(1400, '验证码错误')
    }

  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Req() req) {
    const { imgcode } = req.session
    // 验证码正确
    if(this.checkCodeFun(imgcode, registerDto.checkCode)){
      return this.loginService.register(registerDto);
    }else{
      return this.response.baseResponse(1400, '验证码错误')
    }
  }

  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Req() req) {
    const { imgcode } = req.session
    // 验证码正确
    if(this.checkCodeFun(imgcode, resetPasswordDto.checkCode)){
      return this.loginService.resetPassword(resetPasswordDto);
    }else{
      return this.response.baseResponse(1400, '验证码错误')
    }
  }
}
