export class EmailDto {
    address: string;
    type: 'login' | 'register' | 'reset_password'
}