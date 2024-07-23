import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { EMAIL_USER, EMAIL_PASS, AUTHOR } from '@/config/index'
import { BaseResponse } from '@/common/baseResponse/index';
import { PrismaClient } from '@prisma/client'
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto, ResetPasswordDto } from './dto/auth.dto';
import SparkMD5 from 'spark-md5';
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

@Injectable()
export class AuthService {
  transporter: Transporter;
  
  response = new BaseResponse()

  constructor(
    private jwtService: JwtService,
  ) {
    this.transporter = createTransport({
      host: 'smtp.qq.com', // smtp服务的域名
      port: 587, // smtp服务的端口
      secure: false,
      auth: {
        user: EMAIL_USER, // 你的邮箱地址
        pass: EMAIL_PASS // 你的授权码
      }
    })
  }

  // 发送邮箱
  async sendMail(email: string, type: 'login' | 'register' | 'reset_password') {
    // 生成一个长度为 6 的随机字符串
    const code: string = Math.random().toString().slice(2, 8);

    try {
      const htmlPath: string = path.join(__dirname, '../../../public/email.html');
      const emailTemplate = fs.readFileSync(htmlPath, 'utf-8');
      const validity: number = 5; // 有效期5min
      const emailConfig = {
        code,
        validity,
        name: AUTHOR.NAME
      };
      const emailHtml = ejs.render(emailTemplate, emailConfig)

      // 检查邮箱是否已经注册，邮箱存在且类型对的，更新，否则新增
      const results = await prisma.email_code.findFirst({
        where: { email, type }
      })

      if( results) {
        await prisma.email_code.update({
          where: { id: results.id },
          data: { code }
        })
      }else{
        await prisma.email_code.create({
          data: { email, code, type }
        })
      }

      
      // 发送邮箱
      await this.transporter.sendMail({
        from: {
          name: AUTHOR.PROJECTNAME,
          address: EMAIL_USER
        },
        to: email,
        subject: '注册信息',
        html: emailHtml
      });

      return this.response.baseResponse(1200, '发送成功，请注意查收您的邮箱')
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }


  // 检查邮箱验证码是否正确+是否过期
  async checkEmailCode(args: any, type: 'login'| 'register' | 'reset_password') {
    const code = await prisma.email_code.findMany({
        where: {
            email: args.email,
            type: type
        }
    })
    
    if(code.length === 0) return {
        result: this.response.baseResponse(1400, '请先发送验证码'),
        type: false
    }
    if(code[0].code !== args.emailCode) return {
        result: this.response.baseResponse(1400, '邮箱验证码错误'),
        type: false
    }

    const formattedDate = new Date().toLocaleString('en-US', {timeZone: 'Asia/Shanghai'});
    // 获取nowTime是正常的，但是beforeTime经过new Date 转换之后就多了八个小时,这边还得调整
    const beforeTime = +new Date(code[0].createdTime) - (8 * 60 * 60 * 1000)
    const nowTime = +new Date(formattedDate)
    
    const time = nowTime - beforeTime

    if(time > 5 * 60 * 1000) return {
        result: this.response.baseResponse(1400, '邮箱验证码已过期，请重新获取验证码'),
        type: false
    }

    return {
        result: null,
        type: true
    }
  }

  // 检查密码是否相等
  checkPassword(password: string, passwordConfirm: string) {
      return password !== passwordConfirm
  }
    
  // 登录
  async login(args: LoginDto){
    // 判断有没有这个用户
    const user = await prisma.user.findMany({where: {email: args.email}})
    if(!user.length) return this.response.baseResponse(1400, '该邮箱未注册')
    if(user[0].password !== args.password) return this.response.baseResponse(1400, '密码错误')

    // 登录成功，生成token
    const { userId, email } = user[0]
    const token = this.jwtService.sign({ userId, email })
    // const token = this.response.generateToken(userId)
    return this.response.baseResponse(1200, {
        token: token,
        msg: '登录成功'
    })
  }

  // 注册
  async register(args: RegisterDto){
    const res = await this.checkEmailCode(args, 'register')

    if(!res.type) return res.result
    // 验证码正确了，开始注册账号，先判断这个账号有没有注册
    const user = await prisma.user.findMany({where: {email: args.email}})
    if(user.length > 0) return this.response.baseResponse(1400, '该邮箱已被注册')
        
    const spark = new SparkMD5()
    spark.append(args.password)
    const password = spark.end()

    await prisma.user.create({
        data: {
            email: args.email,
            userId: uuidv4(),
            password: password
        }
    })
    return this.response.baseResponse(1200, '注册成功，请返回登录')
  }
    
  // 重置密码
  async resetPassword(args: ResetPasswordDto){
    const res = await this.checkEmailCode(args, 'reset_password')
    if(!res.type) return res.result

    const user = await prisma.user.findMany({where: {email: args.email}})
    if(user.length === 0) return this.response.baseResponse(1400, '该邮箱未被注册')

    // 更新密码
    const spark = new SparkMD5()
    spark.append(args.password)
    const password = spark.end()

    await prisma.user.update({
        where: {id: user[0].id},
        data: {password: password}
    })

    return this.response.baseResponse(1200, '密码更新成功，请返回登录')
  }
}
