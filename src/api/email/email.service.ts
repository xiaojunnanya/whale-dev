import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { EMAIL_USER, EMAIL_PASS } from '@/config/index'

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com', // smtp服务的域名
      port: 587, // smtp服务的端口
      secure: false,
      auth: {
        user: EMAIL_USER, // 你的邮箱地址
        pass: EMAIL_PASS // 你的授权码
      }
    });
  }

  async sendMail(address: string, type: 'login' | 'register' | 'reset_password') {
    // 生成一个长度为 6 的随机字符串
    const code: string = Math.random().toString().slice(2, 8);

    try {
      const htmlPath: string = path.join(__dirname, '../../../public/email.html');
      const emailTemplate = fs.readFileSync(htmlPath, 'utf-8');
      const validity: number = 5; // 有效期5min
      const emailConfig = {
        code,
        validity,
        name: '鲸落'
      };
      const emailHtml = ejs.render(emailTemplate, emailConfig);


      await this.transporter.sendMail({
        from: {
          name: '鲸灵开发系统',
          address: EMAIL_USER
        },
        to: address,
        subject: '注册信息',
        html: emailHtml
      });

      return '发送成功';
    } catch (e) {
      console.log(e);
      return {
        message: e,
        msg: '发送失败'
      };
      // throw new BusinessException('读取文件失败！');
    }

    
  }
}
