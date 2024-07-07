import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { EMAIL_USER, EMAIL_PASS, AUTHOR } from '@/config/index'
import { BaseResponse } from '@/common/baseResponse/index';
import { EmailCode } from './entities/email.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailService {
  transporter: Transporter;
  
  response = new BaseResponse()

  constructor(
    @InjectRepository(EmailCode)
    private readonly emailRepository: Repository<EmailCode>
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

      // 存储验证码到数据库中
      await this.emailRepository.save({
        email,
        code,
        type
      })

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

      return this.response.baseResponse(200, null)
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }
}
