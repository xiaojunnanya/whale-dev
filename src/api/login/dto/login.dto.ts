import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail({}, {message:'邮箱格式不正确'})
    @IsNotEmpty({message:'邮箱不能为空'})
    email: string;

    @IsNotEmpty({message:'密码不能为空'})
    password: string;

    @IsNotEmpty({ message: '图形验证码不能为空' })
    checkCode: string
}
// 既然注册和重置密码一样为什么不只写一个？
// 因为后续可能会拓展，所以先写两个，如果以后需要合并，可以再合并
export class RegisterDto {
    @IsEmail({}, {message:'邮箱格式不正确'})
    @IsNotEmpty({message:'邮箱不能为空'})
    email: string; // 邮箱

    @IsNotEmpty({ message: '邮箱验证码不能为空' })
    emailCode: string; // 邮箱验证码

    @MinLength(8, { message: '密码长度不能小于8位' })
    @MaxLength(18, { message: '密码长度不能大于18位' })
    @Matches(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/, { message: '密码必须要由数字和字母组成' })
    @IsNotEmpty({ message: '密码不能为空' })
    password: string;

    @IsNotEmpty({ message: '确认密码不能为空' })
    passwordConfirm: string; // 确认密码

    @IsNotEmpty({ message: '图形验证码不能为空' })
    checkCode: string;
}

export class ResetPasswordDto {
    @IsEmail({}, {message:'邮箱格式不正确'})
    @IsNotEmpty({message:'邮箱不能为空'})
    email: string;

    @IsNotEmpty({ message: '邮箱验证码不能为空' })
    emailCode: string;

    @MinLength(8, { message: '密码长度不能小于8位' })
    @MaxLength(18, { message: '密码长度不能大于18位' })
    @Matches(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/, { message: '密码必须要由数字和字母组成' })
    @IsNotEmpty({ message: '密码不能为空' })
    password: string;

    @IsNotEmpty({ message: '确认密码不能为空' })
    passwordConfirm: string;

    @IsNotEmpty({ message: '图形验证码不能为空' })
    checkCode: string;
}