import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
// 换Prisma
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

  @UpdateDateColumn()  // 验证码更新时间
  createDate: Date;
}