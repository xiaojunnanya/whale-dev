import { IsEmail, IsIn, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EmailDto {
    @ApiProperty({description: '邮箱'})
    @IsEmail({}, {message:'邮箱格式不正确'})
    @IsNotEmpty({message:'邮箱不能为空'})
    email: string;

    @ApiProperty({description: 'type'})
    @IsIn(['login', 'register', 'reset_password'], { message: 'type 只能为 login、register、reset_password 中的一个' })
    type: 'login' | 'register' | 'reset_password'
}