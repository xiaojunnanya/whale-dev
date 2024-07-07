import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class EmailCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })  // 类型
  type: 'login' | 'register' | 'reset_password';

  @Column({ type: "varchar" })  // 验证码
  code: string;

  @CreateDateColumn()  // 验证码发送时间
  createDate: Date;
}