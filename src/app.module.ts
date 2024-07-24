import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from '@/api/user/user.module';
import { AuthModule } from '@/api/auth/auth.module';
import { ProjectModule } from '@/api/project/project.module';


@Module({
  imports: [
    UserModule, AuthModule, ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
