import { IsEmail, IsIn, IsNotEmpty } from "class-validator";

export class EmailDto {
    @IsEmail()
    @IsNotEmpty()
    address: string;
    
    @IsIn(['login', 'register', 'reset_password'])
    type: 'login' | 'register' | 'reset_password'
}