import { Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto, ResetPasswordDto } from './dto/login.dto';
import { BaseResponse } from '@/common/baseResponse';
import { PrismaClient } from '@prisma/client'
import * as SparkMD5 from 'spark-md5'
import { v4 as uuidv4 } from 'uuid'
import { JwtService } from '@nestjs/jwt'

const prisma = new PrismaClient()

@Injectable()
export class LoginService {
    
    constructor(
        private jwtService: JwtService,
    ) {}

    response = new BaseResponse()

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
