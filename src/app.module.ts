import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from '@/api/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MYSQL } from '@/config/index'
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: MYSQL.HOST,
      port: MYSQL.PORT,
      username: MYSQL.USER,
      password: MYSQL.PASS,
      database: MYSQL.DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    EmailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
