import { IsEmail, IsIn, IsNotEmpty } from "class-validator";

export class EmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsIn(['login', 'register', 'reset_password'])
    type: 'login' | 'register' | 'reset_password'
}