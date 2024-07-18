import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from '@/api/email/email.module';
import { LoginModule } from '@/api/login/login.module';
@Module({
  imports: [
    EmailModule, LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
